// const mongoose = require("mongoose");

// const otpSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       lowercase: true, // 🔥 normalize email
//       trim: true,
//     },

//     otp: {
//       type: String,
//       required: true,
//     },

//     expiresAt: {
//       type: Date,
//       required: true,
//     },
//   },
//   {
//     timestamps: true, // 🔥 adds createdAt
//   },
// );

// // 🔥 AUTO DELETE OTP after expiry (VERY IMPORTANT)
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// module.exports = mongoose.model("Otp", otpSchema);

// // const mongoose = require("mongoose");

// // const otpSchema = new mongoose.Schema(
// //   {
// //     email: {
// //       type: String,
// //       required: true,
// //       lowercase: true,
// //       trim: true,
// //       index: true, // helpful for lookups
// //     },

// //     otp: {
// //       type: String,
// //       required: true,
// //     },

// //     // 🔥 ADD THESE (temporary signup data)
// //     name: {
// //       type: String,
// //       required: true,
// //     },

// //     password: {
// //       type: String,
// //       required: true, // store HASHED password only
// //     },

// //     expiresAt: {
// //       type: Date,
// //       required: true,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   },
// // );

// // // 🔥 AUTO DELETE OTP after expiry
// // otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// // // (Optional but useful) ensure one active OTP per email
// // otpSchema.index({ email: 1 }, { unique: true });

// // module.exports = mongoose.model("Otp", otpSchema);

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, // one record per email
    },

    otp: {
      type: String,
      required: true,
    },

    // ✅ TEMP USER DATA (IMPORTANT)
    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// ❌ REMOVE TTL (VERY IMPORTANT)
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
