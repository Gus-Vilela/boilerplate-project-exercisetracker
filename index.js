const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});

const userSchema = new mongoose.Schema({
  username: String,
  _id: {
    type: String,
    unique: true,
  },
});

const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

let User = mongoose.model("User", userSchema);

let user = new User({
  username: "RedH",
  _id: "exampleid",
});

user.save();

let Exercise = mongoose.model("Exercise", exerciseSchema);

let exercise = new Exercise({
  username: "RedH",
  description: "Running",
  duration: 60,
  date: new Date(),
});

exercise.save();

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
