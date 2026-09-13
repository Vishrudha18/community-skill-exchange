import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./LiveSession.css";

import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneOff,
  FiMonitor,
  FiUsers,
  FiClock,
  FiMessageCircle,
  FiPaperclip,
  FiSend,
} from "react-icons/fi";

function LiveSession() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const [remoteUserName, setRemoteUserName] = useState("Participant");
  const [remoteConnected, setRemoteConnected] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false); 

  const socket = useRef(null);
  const chatEndRef = useRef(null);

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);
  const remoteUserRef = useRef(null);
  const localStreamRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userName = currentUser?.name || "Participant";
  const isTeacher = session?.teacher?._id === currentUser?._id;

  // ================= SOCKET =================

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      socket.current.emit("joinSession", id);

      socket.current.emit("join-room", {
        roomId: id,
        userName,
      });
    });

    socket.current.on("receiveMessage", (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg._id === data._id ||
            (msg.message === data.message &&
              msg.user === data.user)
        );

        if (exists) return prev;

        return [...prev, data];
      });
    });

    socket.current.on("userTyping", (user) => {
      if (user !== userName) {
        setTypingUser(user);
      }
    });

    socket.current.on("userStopTyping", () => {
      setTypingUser("");
    });

    return () => socket.current.disconnect();
  }, [id, userName]);

  // ================= VIDEO =================

  useEffect(() => {
    if (session?.status !== "live") return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }

        // SPEAKING DETECTION
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone =
          audioContext.createMediaStreamSource(stream);

        microphone.connect(analyser);

        analyser.fftSize = 512;

        const dataArray = new Uint8Array(
          analyser.frequencyBinCount
        );

        const detectSpeaking = () => {
          analyser.getByteFrequencyData(dataArray);

          const volume =
            dataArray.reduce((a, b) => a + b, 0) /
            dataArray.length;

          setIsSpeaking(volume > 20);

          requestAnimationFrame(detectSpeaking);
        };

        detectSpeaking();

        // WEBRTC
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });

        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        peerConnection.current.ontrack = (event) => {
          if (remoteVideo.current) {
            remoteVideo.current.srcObject =
              event.streams[0];
          }

          setRemoteConnected(true);
        };

        peerConnection.current.onicecandidate = (event) => {
          if (
            event.candidate &&
            remoteUserRef.current
          ) {
            socket.current.emit("ice-candidate", {
              candidate: event.candidate,
              to: remoteUserRef.current,
            });
          }
        };

        socket.current.on(
          "user-joined",
          async ({ id, name }) => {
            remoteUserRef.current = id;

            setRemoteUserName(
              name || "Participant"
            );

            setRemoteConnected(true);

            const offer =
              await peerConnection.current.createOffer();

            await peerConnection.current.setLocalDescription(
              offer
            );

            socket.current.emit("offer", {
              offer,
              to: id,
              name: userName,
            });
          }
        );

        socket.current.on(
          "offer",
          async ({ offer, from, name }) => {
            remoteUserRef.current = from;

            setRemoteUserName(
              name || "Participant"
            );

            setRemoteConnected(true);

            await peerConnection.current.setRemoteDescription(
              offer
            );

            const answer =
              await peerConnection.current.createAnswer();

            await peerConnection.current.setLocalDescription(
              answer
            );

            socket.current.emit("answer", {
              answer,
              to: from,
              name: userName,
            });
          }
        );

        socket.current.on(
          "answer",
          async ({ answer, name }) => {
            if (name) {
              setRemoteUserName(name);
            }

            setRemoteConnected(true);

            await peerConnection.current.setRemoteDescription(
              answer
            );
          }
        );

        socket.current.on(
          "ice-candidate",
          async ({ candidate }) => {
            try {
              await peerConnection.current.addIceCandidate(
                candidate
              );
            } catch (err) {
              console.error(err);
            }
          }
        );
      } catch (err) {
        console.error("Failed to start video:", err);
      }
    };

    startVideo();
  }, [session, userName]);

  // ================= SCREEN SHARE =================

  const startScreenShare = async () => {
    try {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

      const screenTrack =
        screenStream.getTracks()[0];

      const sender =
        peerConnection.current
          ?.getSenders()
          .find(
            (s) =>
              s.track?.kind === "video"
          );

      if (sender) {
        sender.replaceTrack(screenTrack);
      }

      if (localVideo.current) {
        localVideo.current.srcObject =
          screenStream;
      }

      setIsSharing(true);

      screenTrack.onended = stopScreenShare;
    } catch (err) {
      console.error(err);
    }
  };

  const stopScreenShare = () => {
    const videoTrack =
      localStreamRef.current
        ?.getTracks()
        .find(
          (track) =>
            track.kind === "video"
        );

    const sender =
      peerConnection.current
        ?.getSenders()
        .find(
          (s) =>
            s.track?.kind === "video"
        );

    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack);
    }

    if (localVideo.current) {
      localVideo.current.srcObject =
        localStreamRef.current;
    }

    setIsSharing(false);
  };

  // ================= CONTROLS =================

  const toggleMute = () => {
    const audioTrack =
      localStreamRef.current
        ?.getTracks()
        .find(
          (track) =>
            track.kind === "audio"
        );

    if (audioTrack) {
      audioTrack.enabled =
        !audioTrack.enabled;

      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack =
      localStreamRef.current
        ?.getTracks()
        .find(
          (track) =>
            track.kind === "video"
        );

    if (videoTrack) {
      videoTrack.enabled =
        !videoTrack.enabled;

      setIsVideoOff(
        !videoTrack.enabled
      );
    }
  };

  const leaveCall = async () => {
    localStreamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    peerConnection.current?.close();

    socket.current.disconnect();

    if (isTeacher) {
      try {
        const token =
          localStorage.getItem("token");

        await axios.put(
          `/api/sessions/${id}/complete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error(
          "Failed to mark session complete:",
          err
        );
      }
    }

    window.location.href = "/sessions";
  };

  // ================= CHAT =================

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      sessionId: id,
      message,
      user: userName || "User",
      userId: currentUser?._id,
    };

    socket.current.emit(
      "sendMessage",
      msgData
    );

    socket.current.emit(
      "stopTyping",
      id
    );

    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  // ================= FETCH =================

  const fetchSession = useCallback(
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          `/api/sessions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSession(res.data);
      } catch (err) {
        console.error(
          "Failed to load session:",
          err
        );
      }
    },
    [id]
  );

  const fetchMessages = useCallback(
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          `/api/messages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(res.data);
      } catch (err) {
        console.error(
          "Failed to load messages",
          err
        );
      }
    },
    [id]
  );

  useEffect(() => {
    fetchSession();
    fetchMessages();
  }, [
    fetchSession,
    fetchMessages,
  ]);

  // ================= HELPERS =================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "Time unavailable";

    return new Date(date).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (!session) {
    return (
      <div className="live-loading">
        <div className="loading-spinner" />
        <p>Loading session...</p>
      </div>
    );
  }

  // ================= ERROR STATES =================

  if (!session.scheduledAt) {
    return (
      <div className="live-error">
        <div className="error-icon">📅</div>
        <h2>Meeting Not Scheduled</h2>
        <p>
          The teacher has not scheduled this
          meeting yet.
        </p>
      </div>
    );
  }

  if (session.status === "scheduled") {
    return (
      <div className="live-error">
        <div className="error-icon">⏳</div>
        <h2>Meeting Not Started</h2>
        <p>
          The teacher hasn't started this
          meeting yet. Please wait.
        </p>
      </div>
    );
  }

  if (session.status === "completed") {
    return (
      <div className="live-error">
        <div className="error-icon">✓</div>
        <h2>Session Completed</h2>
        <p>
          This meeting has already ended.
        </p>
      </div>
    );
  }

  if (session.status === "cancelled") {
    return (
      <div className="live-error">
        <div className="error-icon">×</div>
        <h2>Session Cancelled</h2>
        <p>
          This meeting is no longer available.
        </p>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div className="live-container">

      {/* =====================================
          SESSION TOP BAR
          ===================================== */}

      <div className="live-session-bar">

        <div className="session-title-group">

          <div className="live-status">
            <span className="live-dot" />
            Live Session
          </div>

          <div className="session-title">
            <h1>
              {session.skill?.name ||
                "Skill Session"}
            </h1>

            <span className="session-with">
              With:
              <strong>
                {isTeacher
                  ? session.learner?.name
                  : session.teacher?.name}
              </strong>
            </span>
          </div>

        </div>

        <div className="session-top-actions">

          <div className="session-stat">
            <FiUsers />
            <span>2 Participants</span>
          </div>

          <div className="session-stat">
            <FiClock />
            <span>Live</span>
          </div>

        </div>

      </div>


      {/* =====================================
          MAIN CONTENT
          ===================================== */}

      <div className="live-body">

        {/* =================================
            VIDEO SIDE
            ================================= */}

        <main className="video-section">

          <div className="video-grid">

            {/* LOCAL VIDEO */}

            <div
              className={`video-card local-video-card ${
                isSpeaking
                  ? "speaking"
                  : ""
              }`}
            >

              {!isVideoOff ? (
                <video
                  ref={localVideo}
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <div className="video-placeholder">
                  <div className="large-avatar">
                    {getInitials(userName)}
                  </div>
                  <span>Camera Off</span>
                </div>
              )}

              <div className="video-top-left">
                <span className="you-label">
                  <span className="person-dot" />
                  You
                </span>
              </div>

              <div className="video-bottom-left">
                <span className="name-label">
                  {userName}
                </span>
              </div>

              <div className="connection-indicator">
                <span />
                <span />
                <span />
              </div>

            </div>


            {/* REMOTE VIDEO */}

            <div className="video-card remote-video-card">

              {remoteConnected ? (
                <video
                  ref={remoteVideo}
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="remote-placeholder">

                  <div className="remote-avatar">
                    {getInitials(
                      remoteUserName
                    )}
                  </div>

                  <span>
                    Waiting for participant...
                  </span>

                </div>
              )}

              <div className="video-bottom-left">
                <span className="name-label">
                  <span className="person-dot" />
                  {remoteUserName}
                </span>
              </div>

              {remoteConnected && (
                <div className="connection-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              )}

            </div>

          </div>


          {/* =================================
              CONTROLS
              ================================= */}

          <div className="controls-wrapper">

            <div className="controls-dock">

              <button
                className={`dock-control ${
                  isMuted ? "off" : ""
                }`}
                onClick={toggleMute}
              >
                <span className="control-icon">
                  {isMuted ? (
                    <FiMicOff />
                  ) : (
                    <FiMic />
                  )}
                </span>

                <span className="control-label">
                  {isMuted
                    ? "Unmute"
                    : "Mic"}
                </span>
              </button>


              <button
                className={`dock-control ${
                  isVideoOff ? "off" : ""
                }`}
                onClick={toggleVideo}
              >
                <span className="control-icon">
                  {isVideoOff ? (
                    <FiVideoOff />
                  ) : (
                    <FiVideo />
                  )}
                </span>

                <span className="control-label">
                  Camera
                </span>
              </button>


              <button
                className={`dock-control ${
                  isSharing
                    ? "sharing"
                    : ""
                }`}
                onClick={
                  isSharing
                    ? stopScreenShare
                    : startScreenShare
                }
              >
                <span className="control-icon">
                  <FiMonitor />
                </span>

                <span className="control-label">
                  Screen
                </span>
              </button>

              <button
                className="dock-control leave-control"
                onClick={leaveCall}
              >
                <span className="control-icon">
                  <FiPhoneOff />
                </span>

                <span className="control-label">
                  Leave
                </span>
              </button>

            </div>

          </div>


          {/* =================================
              SESSION DETAILS
              ================================= */}

          <div className="session-details">

            <div className="details-icon">
              <span>&lt;/&gt;</span>
            </div>

            <div className="details-content">

              <h3>Session Details</h3>

              <div className="details-row">

                <span>
                  {session.skill?.name ||
                    "Skill Session"}
                </span>

                <i />

                <span>
                  <FiClock />
                  {formatDate(
                    session.scheduledAt
                  )}
                </span>

                <i />

                <span>
                  <FiClock />
                  {formatTime(
                    session.scheduledAt
                  )}
                </span>

              </div>

            </div>

          </div>

        </main>


        {/* =================================
            CHAT
            ================================= */}

        <aside className="chat-area">

          {/* CHAT HEADER */}

          <div className="chat-header">

            <div className="chat-title">
              <FiMessageCircle />

              <h2>Chat</h2>
            </div>

          </div>


          {/* CHAT TABS */}

          <div className="chat-tabs">

            <button className="active">
              Messages
            </button>

            <button>
              Participants (2)
            </button>

          </div>


          {/* MESSAGES */}

          <div className="chat-messages">

            {messages.length === 0 &&
              !typingUser && (
                <div className="empty-chat">
                  <div className="empty-chat-icon">
                    <FiMessageCircle />
                  </div>

                  <h3>No messages yet</h3>

                  <p>
                    Start the conversation
                    with your session partner.
                  </p>
                </div>
              )}

            {messages.map((msg, i) => {

              const isMe =
                msg.user === userName;

              return (
                <div
                  key={
                    msg._id || i
                  }
                  className={`chat-row ${
                    isMe
                      ? "me"
                      : "other"
                  }`}
                >

                  {!isMe && (
                    <div className="chat-avatar">
                      {getInitials(
                        msg.user
                      )}
                    </div>
                  )}

                  <div className="message-content">

                    <div className="message-header">

                      <span className="sender">
                        {isMe
                          ? "You"
                          : msg.user}
                      </span>

                      <small>
                        {msg.time
                          ? new Date(
                              msg.time
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )
                          : msg.createdAt
                          ? new Date(
                              msg.createdAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )
                          : ""}
                      </small>

                    </div>

                    <div className="chat-bubble">
                      <p>
                        {msg.message ||
                          msg.content}
                      </p>

                      {isMe && (
                        <span className="message-check">
                          ✓✓
                        </span>
                      )}
                    </div>

                  </div>

                  {isMe && (
                    <div className="chat-avatar my-avatar">
                      {getInitials(
                        userName
                      )}
                    </div>
                  )}

                </div>
              );
            })}


            {/* TYPING */}

            {typingUser && (
              <div className="chat-row other">

                <div className="chat-avatar">
                  {getInitials(
                    typingUser
                  )}
                </div>

                <div className="message-content">

                  <div className="message-header">
                    <span className="sender">
                      {typingUser}
                    </span>
                  </div>

                  <div className="chat-bubble typing">

                    <span>
                      Typing
                    </span>

                    <div className="dots">
                      <span />
                      <span />
                      <span />
                    </div>

                  </div>

                </div>

              </div>
            )}

            <div ref={chatEndRef} />

          </div>


          {/* CHAT INPUT */}

          <div className="chat-input-wrapper">

            <div className="chat-input">

              <button
                className="attachment-btn"
                type="button"
              >
                <FiPaperclip />
              </button>

              <input
                value={message}
                onChange={(e) => {
                  setMessage(
                    e.target.value
                  );

                  socket.current.emit(
                    "typing",
                    id,
                    userName
                  );

                  clearTimeout(
                    window.typingTimeout
                  );

                  window.typingTimeout =
                    setTimeout(() => {
                      socket.current.emit(
                        "stopTyping",
                        id
                      );
                    }, 1000);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
              />

              <button
                className="send-btn"
                onClick={sendMessage}
              >
                <span>Send</span>
                <FiSend />
              </button>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default LiveSession;