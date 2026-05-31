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
  FiMonitor
} from "react-icons/fi";

function LiveSession() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const [remoteUserName, setRemoteUserName] = useState("Participant");
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
      setMessages((prev) => [...prev, data]);
    });

    socket.current.on("userTyping", (user) => {
      if (user !== userName) setTypingUser(user);
    });

    socket.current.on("userStopTyping", () => {
      setTypingUser("");
    });

    return () => socket.current.disconnect();
  }, [id, userName]);

  // ================= VIDEO =================
  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      localVideo.current.srcObject = stream;

      // 🎤 SPEAKING DETECTION
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyser.fftSize = 512;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectSpeaking = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume =
          dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        setIsSpeaking(volume > 20);
        requestAnimationFrame(detectSpeaking);
      };

      detectSpeaking();

      // ================= WEBRTC =================
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        remoteVideo.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && remoteUserRef.current) {
          socket.current.emit("ice-candidate", {
            candidate: event.candidate,
            to: remoteUserRef.current,
          });
        }
      };

      socket.current.on("user-joined", async ({ id, name }) => {
        remoteUserRef.current = id;
        setRemoteUserName(name || "Participant");

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.current.emit("offer", {
          offer,
          to: id,
          name: userName,
        });
      });

      socket.current.on("offer", async ({ offer, from, name }) => {
        remoteUserRef.current = from;
        setRemoteUserName(name);

        await peerConnection.current.setRemoteDescription(offer);

        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.current.emit("answer", {
          answer,
          to: from,
          name: userName,
        });
      });

      socket.current.on("answer", async ({ answer, name }) => {
        if (name) setRemoteUserName(name);
        await peerConnection.current.setRemoteDescription(answer);
      });

      socket.current.on("ice-candidate", async ({ candidate }) => {
        try {
          await peerConnection.current.addIceCandidate(candidate);
        } catch (err) {
          console.error(err);
        }
      });
    };

    startVideo();
  }, [userName]);

  // ================= SCREEN SHARE =================
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = screenStream.getTracks()[0];

      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track.kind === "video");

      if (sender) sender.replaceTrack(screenTrack);

      localVideo.current.srcObject = screenStream;
      setIsSharing(true);

      screenTrack.onended = stopScreenShare;
    } catch (err) {
      console.error(err);
    }
  };

  const stopScreenShare = () => {
    const videoTrack = localStreamRef.current
      .getTracks()
      .find((track) => track.kind === "video");

    const sender = peerConnection.current
      .getSenders()
      .find((s) => s.track.kind === "video");

    if (sender && videoTrack) sender.replaceTrack(videoTrack);

    localVideo.current.srcObject = localStreamRef.current;
    setIsSharing(false);
  };

  // ================= CONTROLS =================
  const toggleMute = () => {
    const audioTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const leaveCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
    socket.current.disconnect();
    window.location.href = "/sessions";
  };

  // ================= CHAT =================
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      sessionId: id,
      message,
      user: userName || "User",
    };

    setMessages((prev) => [...prev, msgData]);

    socket.current.emit("sendMessage", msgData);
    socket.current.emit("stopTyping", id);

    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // ================= FETCH =================
  const fetchSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/sessions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSession(res.data);
  }, [id]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // ================= TIMER =================
  useEffect(() => {
    if (!session?.scheduledAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(session.scheduledAt);
      const end = new Date(start.getTime() + session.duration * 60000);

      if (now < start) setStatus("⏳ Not started");
      else if (now <= end) setStatus("🔴 LIVE");
      else setStatus("Session Ended");
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session) return <p>Loading...</p>;

  return (
    <div className="live-container">
      <div className="live-header">
        <h2>Live Session</h2>
        <span className={`live-status ${status.includes("LIVE") ? "live" : ""}`}>
          {status}
        </span>
      </div>

      <div className="live-body">
        {/* VIDEO */}
        <div className="video-section">
          <div className="video-grid">
            <div className={`video-card ${isSpeaking ? "speaking" : ""}`}>
              <video ref={localVideo} autoPlay muted />
              <span className="label">{userName}</span>
            </div>

            <div className="video-card">
              <video ref={remoteVideo} autoPlay />
              <span className="label">{remoteUserName}</span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="controls-dock">
            <button
              className={`dock-btn ${isMuted ? "off" : ""}`}
              onClick={toggleMute}
            >
              {isMuted ? <FiMicOff /> : <FiMic />}
            </button>

            <button
              className={`dock-btn ${isVideoOff ? "off" : ""}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? <FiVideoOff /> : <FiVideo />}
            </button>

            <button
              className={`dock-btn ${isSharing ? "active" : ""}`}
              onClick={isSharing ? stopScreenShare : startScreenShare}
            >
              <FiMonitor />
            </button>

            <button className="dock-btn leave" onClick={leaveCall}>
              <FiPhoneOff />
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div className="chat-area">
          <h3>Chat</h3>

          <div className="chat-messages">
            {messages.map((msg, i) => {
              const isMe = msg.user === userName;

              return (
                <div key={i} className={`chat-row ${isMe ? "me" : "other"}`}>
                  <div className="chat-bubble">
                    {!isMe && <span className="sender">{msg.user}</span>}
                    <p>{msg.message}</p>
                  </div>
                </div>
              );
            })}

            {typingUser && (
              <div className="chat-row other">
                <div className="chat-bubble typing">
                  <span className="sender">{typingUser}</span>
                  <p>Typing...</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);

                socket.current.emit("typing", id, userName);

                clearTimeout(window.typingTimeout);
                window.typingTimeout = setTimeout(() => {
                  socket.current.emit("stopTyping", id);
                }, 1000);
              }}
              placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveSession;