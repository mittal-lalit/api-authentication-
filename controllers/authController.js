const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashpassword");
// ==============================
// REGISTER API
// ==============================
// Purpose:
// - Create a new user account
// - Hash password before saving
// - Prevent duplicate email registration
//
// Request Body:
// {
//   name: String,
//   email: String,
//   password: String
// }
//
// Response:
// - 201: User registered successfully
// - 400: User already registered
// - 500: Server error
exports.register = async (req, res) => {
    try {
        // Extract data from request body
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        // Hash the password for security
        const hashedPassword = await hashPassword(password);

        // Create new user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Send success response (without password)
        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==============================
// LOGIN API
// ==============================
// Purpose:
// - Authenticate user using email & password
// - Compare hashed password
//
// Request Body:
// {
//   email: String,
//   password: String
// }
//
// Response:
// - 200: Login successful
// - 400: Invalid credentials
// - 500: Server error
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare entered password with stored hash
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Successful login response
        res.json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==============================
// FORGET PASSWORD API
// ==============================
// Purpose:
// - Generate a reset token for password recovery
// - Save token in database
//
// Request Body:
// {
//   email: String
// }
//
// Response:
// - 200: Reset token generated
// - 404: User not found
exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate random reset token
    const token = Math.random().toString(36).substring(2);

    // Save token in database
    user.resetToken = token;
    await user.save();

    // In real apps, token should be emailed (not returned)
    res.json({ message: "Reset token generated", token });
};


// ==============================
// RESET PASSWORD API
// ==============================
// Purpose:
// - Reset password using valid reset token
// - Hash new password
//
// Request Body:
// {
//   token: String,
//   newPassword: String
// }
//
// Response:
// - 200: Password reset successful
// - 400: Invalid token
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findOne({ resetToken: token });
    if (!user) {
        return res.status(400).json({ message: "Invalid token" });
    }

    // Hash and update new password
    user.password = await hashPassword(newPassword);
    user.resetToken = null;
    await user.save();

    res.json({ message: "Password reset successful" });
};


// ==============================
// PROFILE API
// ==============================
// Purpose:
// - Fetch user profile details
// - Exclude password from response
//
// Params:
// - id (User ID)
//
// Response:
// - 200: User profile data
// - 404: User not found
exports.profile = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};


// ==============================
// LOGOUT API
// ==============================
// Purpose:
// - Logout user
// - (In JWT-based auth, logout is handled client-side)
//
// Response:
// - 200: Logout successful
exports.logout = (req, res) => {
    res.json({ message: "Logout successful" });
};
