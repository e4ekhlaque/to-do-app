const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   REGISTER
========================= */
const register = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    password = password?.trim();

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (phone.length !== 10) {
      return res.status(400).json({
        message: "Phone number must be 10 digits",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existsEmail = await User.findOne({ email });

    if (existsEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existsPhone = await User.findOne({ phone });

    if (existsPhone) {
      return res.status(400).json({
        message: "Phone already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hash,
    });

    return res.status(201).json({
      message: "Registered successfully",
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      message: "Login successful",
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.json({
        message: "If account exists, reset link sent.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const response = await resend.emails.send({
      from: "Todo App <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset password:</p>

        <a href="${link}"
          style="
            padding:12px 20px;
            background:#6366f1;
            color:white;
            text-decoration:none;
            border-radius:8px;
            display:inline-block;
          ">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

    console.log("EMAIL SENT:", response);

    return res.json({
      message: "Reset link sent to your email.",
    });
  } catch (err) {
    console.log("FORGOT ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired link",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    return res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired link",
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
