module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Video user connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", ({ roomId, userName }) => {
      const safeName = userName || "Participant";
      
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", {
        id: socket.id,
        name: safeName,
      });
    });

    // OFFER
    socket.on("offer", ({ offer, to }) => {
      io.to(to).emit("offer", {
        offer,
        from: socket.id,
      });
    });

    // ANSWER
    socket.on("answer", ({ answer, to }) => {
      io.to(to).emit("answer", {
        answer,
        from: socket.id,
      });
    });

    // ICE
    socket.on("ice-candidate", ({ candidate, to }) => {
      io.to(to).emit("ice-candidate", {
        candidate,
        from: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log("Video user disconnected:", socket.id);
    });
  });
};