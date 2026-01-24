const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.js"); // 

const port = 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/testdb")
.then(() => console.log("connected to db"))
.catch((err) => console.log(err));

// SERVER
app.listen(port, () => {
    console.log("connect to port 3000");
});

// HOME API
app.get("/home", (req, res) => {
    res.send("home api");
});

// REGISTER (POST)
app.post("/register", async (req, res) => {
    try {
        console.log("BODY:", req.body); // 👈 add this

        const { name, email, password } = req.body;

        const user = new User({ name, email, password });
        await user.save();

        res.json({ message: "User registered successfully", user });

    } catch (err) {
        console.log("REGISTER ERROR 👉", err); // 👈 add this
        res.status(500).json({ message: err.message });
    }
});

// LOGIN (POST)
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
});

// FORGET PASSWORD (POST)
app.post("/forget-password", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const token = Math.random().toString(36).substring(2);
    user.resetToken = token;
    await user.save();

    res.json({ message: "Reset token generated", token });
});

// RESET PASSWORD (PUT)
app.put("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ resetToken: token });
    if (!user) {
        return res.status(400).json({ message: "Invalid token" });
    }

    user.password = newPassword;
    user.resetToken = null;
    await user.save();

    res.json({ message: "Password reset successful" });
});

// PROFILE (GET)
app.get("/profile/:id", async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

// LOGOUT (DELETE)
app.delete("/logout/:id", (req, res) => {
    res.json({ message: "Logout successful" });
});
