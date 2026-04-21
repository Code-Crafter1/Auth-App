const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
// app.use(cors());
corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ✅ GLOBAL RESPONSE MIDDLEWARE (IMPORTANT)
app.use((req, res, next) => {
  res.success = (message, data = {}) => {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  };

  res.error = (message, status = 400) => {
    res.status(status).json({
      success: false,
      message,
    });
  };

  next();
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.get("/", (req, res) => {
  res.success("API is running 🚀");
});

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// server
app.listen(3000, () => console.log("Server running on port 3000"));
