const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/availability", require("./routes/availabilityRoutes"));

app.get("/test", (req, res) => {
  res.json({ message: "Server working" });
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// SERVER + SOCKET
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// ✅ IMPORT SOCKET MODULES
require("./socket/chatSocket")(io);
require("./socket/videoSocket")(io);

server.listen(5000, () => console.log("Server running on 5000"));