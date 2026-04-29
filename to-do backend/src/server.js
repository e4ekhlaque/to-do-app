require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5003;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", todoRoutes);
app.use("/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed:", err.message));

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
