const express = require("express");
const router = express.Router();

const {
    register,
    login,
    forgetPassword,
    resetPassword,
    profile,
    logout
} = require("../controllers/authController");

const { validateRegister, validateLogin } = require("../middleware/validate");


/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @headers
 *   Content-Type: application/json
 * @body
 *   {
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "password": "Password@123"
 *   }
 */
router.post("/register", validateRegister, register);


/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 * @headers
 *   Content-Type: application/json
 * @body
 *   {
 *     "email": "john@example.com",
 *     "password": "Password@123"
 *   }
 */
router.post("/login", validateLogin, login);



/**
 * @route   POST /api/auth/forget-password
 * @desc    Send password reset link / OTP to registered email
 * @access  Public
 * @headers
 *   Content-Type: application/json
 * @body
 *   {
 *     "email": "john@example.com"
 *   }
 */
router.post("/forget-password", forgetPassword);


/**
 * @route   PUT /api/auth/reset-password
 * @desc    Reset user password using token / OTP
 * @access  Public
 * @headers
 *   Content-Type: application/json
 * @body
 *   {
 *     "token": "reset-token",
 *     "newPassword": "NewPassword@123"
 *   }
 */
router.put("/reset-password", resetPassword);


/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user's profile with id
 * @access  Private
 * @headers
 *   Authorization: id
 */
router.get("/profile/:id", profile);

/**
 * @route   DELETE /api/auth/logout
 * @desc    Logout user 
 * @access  Private
 * @headers
 *   Authorization: Bearer <JWT_TOKEN>
 */
router.delete("/logout",logout);

module.exports = router;

