const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Chat user connected:", socket.id);

    socket.on("joinSession", (sessionId) => {
      socket.join(sessionId);
    });

    socket.on("sendMessage", async ({ sessionId, message, user, userId }) => {
      console.log("MESSAGE RECEIVED:", {
  sessionId,
  message,
  user,
  userId,
});
      try {
        // Save message to DB
        const savedMessage = await Message.create({
  session: sessionId,
  sender: userId,
  senderName: user,
  content: message,
});

        // Send to everyone in room
        io.to(sessionId).emit("receiveMessage", {
          _id: savedMessage._id,
          message: savedMessage.content,
          user,
          sender: userId,
          time: savedMessage.createdAt,
        });

      } catch (error) {
        console.error("Chat save error:", error);
      }
    });

    socket.on("typing", (sessionId, user) => {
      socket.to(sessionId).emit("userTyping", user);
    });

    socket.on("stopTyping", (sessionId) => {
      socket.to(sessionId).emit("userStopTyping");
    });

    socket.on("disconnect", () => {
      console.log("Chat user disconnected:", socket.id);
    });
  });
};