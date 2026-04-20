const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // 🔥 remove extra spaces
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // 🔥 convert to lowercase automatically
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6, // 🔥 basic security
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // 🔥 createdAt & updatedAt
  },
);

module.exports = mongoose.model("User", userSchema);
