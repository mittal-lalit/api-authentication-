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

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/forget-password", forgetPassword);
router.put("/reset-password", resetPassword);
router.get("/profile/:id", profile);
router.delete("/logout", logout);

module.exports = router;

