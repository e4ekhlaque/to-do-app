const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: String,
    otpExpire: Date,
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
