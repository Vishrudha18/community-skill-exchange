module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Chat user connected:", socket.id);

    socket.on("joinSession", (sessionId) => {
      socket.join(sessionId);
    });

    socket.on("sendMessage", ({ sessionId, message, user }) => {
      io.to(sessionId).emit("receiveMessage", {
        message,
        user,
        time: new Date(),
      });
    });

    socket.on("typing", (sessionId, user) => {
      socket.to(sessionId).emit("userTyping", user);
    });

    socket.on("stopTyping", (sessionId) => {
      socket.to(sessionId).emit("userStopTyping");
    });
  });
};