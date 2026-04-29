require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5003;

/* Middlewares */
app.use(
  cors({
    origin: [
      "https://to-do-app-tau-three-89.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

/* Routes */
app.use("/tasks", todoRoutes);
app.use("/auth", authRoutes);

/* Health Check */
app.get("/", (req, res) => {
  res.send("API running successfully");
});

/* MongoDB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed:", err.message));

/* Start Server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
