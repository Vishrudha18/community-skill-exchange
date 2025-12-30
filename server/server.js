const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Community Skill Exchange API running");
});

// database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
