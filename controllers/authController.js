const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashpassword");

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// FORGET PASSWORD
exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const token = Math.random().toString(36).substring(2);
    user.resetToken = token;
    await user.save();

    res.json({ message: "Reset token generated", token });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ resetToken: token });
    if (!user) {
        return res.status(400).json({ message: "Invalid token" });
    }

    user.password = await hashPassword(newPassword);
    user.resetToken = null;
    await user.save();

    res.json({ message: "Password reset successful" });
};

// PROFILE
exports.profile = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};

// LOGOUT
exports.logout = (req, res) => {
    res.json({ message: "Logout successful" });
};
