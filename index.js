const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { nanoid } = require("nanoid");
let bodyParser = require("body-parser");
mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const exerciseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
  _id: {
    type: String,
    default: () => nanoid(24),
    unique: true,
  },
});

const userSchema = new mongoose.Schema({
  username: String,
  _id: {
    type: String,
    default: () => nanoid(24),
    unique: true,
  },
});

const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  _id: {
    type: String,
    default: () => nanoid(24),
    unique: true,
  },
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", exerciseSchema);

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/users", async (req, res) => {
  console.log(req.body.username);

  try {
    let newUser = new User({
      username: req.body.username,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const user_id = req.body[":_id"];
  const desc = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;

  try {
    const existingUser = await User.findOne({ _id: user_id });
    if (existingUser) {
      console.log(existingUser);
      let newExercise = new Exercise({
        user_id: user_id,
        description: desc,
        duration: duration,
        date: date ? new Date(date) : new Date(),
      });
      const savedExercise = await newExercise.save();
      return res.json({
        user_id: savedExercise.user_id,
        username: existingUser.username,
        description: savedExercise.description,
        duration: savedExercise.duration,
        date: new Date(savedExercise.date).toDateString(),
      });
    } else {
      res.send("User not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
