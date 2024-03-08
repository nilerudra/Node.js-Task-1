const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

app.use(express.json());

const KEY = "random";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

mongoose.connect(
  "mongodb+srv://rudrakshnile:nilerudra064@cluster0.caaeero.mongodb.net/user",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.post("/users/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User Already Exists!!" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully!!", token });
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && user.password === password) {
    const token = jwt.sign({ username, role: "user" }, KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully...", token });
  } else {
    res.status(403).json({ message: "Invalid username or password !!" });
  }
});

app.post("/users/forgot-password", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const newPassword = req.headers.newpassword;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user && user.password === password) {
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password Updated Successfully" });
  } else {
    return res.status(403).json({ message: "Invalid username or password" });
  }
});

module.exports = app;

// app.listen(3000, () => {
//   console.log("Server is listening on port 3000");
// });
