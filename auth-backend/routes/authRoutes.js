const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// import middleware
const protect = require("../middleware/authMiddleware");

// auth routes
router.post("/signup", auth.signup);
router.post("/verify-otp", auth.verifyOtp);
router.post("/login", auth.login);
router.post("/resend-otp", auth.resendOtp);
router.post("/logout", protect, auth.logout);

// ✅ protected route (clean)
router.get("/dashboard", protect, auth.getProfile);

module.exports = router;