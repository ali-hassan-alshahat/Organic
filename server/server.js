const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Listening in port 8000");
});
