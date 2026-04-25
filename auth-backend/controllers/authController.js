const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

const sendEmail = require("../utils/sendEmail");
const { generateOtp, getOtpExpiry } = require("../utils/otpService");

// ✅ SIGNUP
// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.error("All fields are required", 400);
//     }

//     const emailLower = email.toLowerCase();

//     const userExist = await User.findOne({ email: emailLower });
//     if (userExist) return res.error("User already exists", 400);

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email: emailLower,
//       password: hashedPassword,
//     });

//     const otp = generateOtp();

//     await Otp.findOneAndUpdate(
//       { email: emailLower },
//       { otp, expiresAt: getOtpExpiry() },
//       { upsert: true, returnDocument: "after" },
//     );

//     await sendEmail(emailLower, otp);

//     res.success("Signup successful, OTP sent");
//   } catch (err) {
//     res.error(err.message || "Server error", 500);
//   }
// };

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.error("All fields are required", 400);
    }

    const emailLower = email.toLowerCase();

    // ❌ check only verified user
    const existingUser = await User.findOne({
      email: emailLower,
      isVerified: true,
    });

    if (existingUser) {
      return res.error("User already exists. Please login.", 400);
    }

    // 🔥 check OTP record (important)
    const existingOtp = await Otp.findOne({ email: emailLower });

    if (existingOtp && existingOtp.expiresAt > Date.now()) {
      return res.success("OTP already sent. Please verify your email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    // ✅ store temp data in OTP collection
    await Otp.findOneAndUpdate(
      { email: emailLower },
      {
        email: emailLower,
        name,
        password: hashedPassword,
        otp,
        expiresAt: getOtpExpiry(),
      },
      { upsert: true, returnDocument: "after" },
    );

    await sendEmail(emailLower, otp);

    res.json({
      success: true,
      message: "Signup successful, OTP sent. Please verify your email.",
    });
  } catch (err) {
    res.error(err.message || "Server error", 500);
  }
};

// ✅ VERIFY OTP
// exports.verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.error("Email and OTP are required", 400);
//     }

//     const emailLower = email.toLowerCase();

//     const record = await Otp.findOne({ email: emailLower }).sort({
//       createdAt: -1,
//     });

//     if (!record || record.otp !== otp) return res.error("Invalid OTP", 400);

//     if (record.expiresAt < Date.now()) return res.error("OTP expired", 400);

//     await User.updateOne({ email: emailLower }, { isVerified: true });

//     await Otp.deleteOne({ email: emailLower });

//     res.success("Account verified");
//   } catch (err) {
//     res.error(err.message || "Server error", 500);
//   }
// };

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.error("Email and OTP are required", 400);
    }

    const emailLower = email.toLowerCase();

    const record = await Otp.findOne({ email: emailLower });

    if (!record || record.otp !== otp) {
      return res.error("Invalid OTP", 400);
    }

    if (record.expiresAt < Date.now()) {
      return res.error("OTP expired", 400);
    }

    // ✅ create user now
    await User.create({
      name: record.name,
      email: record.email,
      password: record.password,
      isVerified: true,
    });

    await Otp.deleteOne({ email: emailLower });

    res.success("Account created successfully");
  } catch (err) {
    res.error(err.message || "Server error", 500);
  }
};

// ✅ LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.error("Email and password are required", 400);
//     }

//     const emailLower = email.toLowerCase();

//     const user = await User.findOne({ email: emailLower });

//     if (!user) return res.error("User not found", 400);

//     if (!user.isVerified) return res.error("Verify email first", 400);

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) return res.error("Wrong password", 400);

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.success("Login successful", { token });
//   } catch (err) {
//     res.error(err.message || "Server error", 500);
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });

    if (!user) return res.error("User not found", 400);

    if (!user.isVerified) return res.error("Verify email first", 400);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.error("Wrong password", 400);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //restrict multiple logins
    await Session.deleteMany({ userId: user._id });

    // ✅ create session
    await Session.create({
      userId: user._id,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.success("Login successful", { token });
  } catch (err) {
    res.error(err.message || "Server error", 500);
  }
};

// ✅ RESEND OTP
// exports.resendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.error("Email is required", 400);
//     }

//     const emailLower = email.toLowerCase();

//     const user = await User.findOne({ email: emailLower });

//     if (!user) return res.error("User not found", 400);

//     const otp = generateOtp();

//     await Otp.findOneAndUpdate(
//       { email: emailLower },
//       { otp, expiresAt: getOtpExpiry() },
//       { upsert: true, returnDocument: "after" },
//     );

//     await sendEmail(emailLower, otp);

//     res.success("OTP resent");
//   } catch (err) {
//     res.error(err.message || "Server error", 500);
//   }
// };

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.error("Email is required", 400);
    }

    const emailLower = email.toLowerCase();

    const record = await Otp.findOne({ email: emailLower });

    if (!record) {
      return res.error("Please signup first", 400);
    }

    const otp = generateOtp();

    record.otp = otp;
    record.expiresAt = getOtpExpiry();

    await record.save();

    await sendEmail(emailLower, otp);

    res.success("OTP resent successfully");
  } catch (err) {
    res.error(err.message || "Server error", 500);
  }
};

// ✅ GET PROFILE (Protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.error("User not found", 404);

    res.success("Profile fetched", user);
  } catch (err) {
    res.error(err.message || "Server error", 500);
  }
};

// ✅ LOGOUT

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    await Session.deleteOne({ token });

    res.success("Logged out successfully");
  } catch (err) {
    res.error(err.message || "Server error", 500);
  }
};
