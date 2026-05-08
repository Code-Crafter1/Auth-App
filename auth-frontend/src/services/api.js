// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: "https://auth-app-uzjr.onrender.com/api/auth",
// // });

// // export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://auth-app-uzjr.onrender.com/api/auth",
// });

// //  Attach token automatically
// API.interceptors.request.use((config) => {
//   // const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// //  AUTH APIs

// export const signupUser = (data) => API.post("/signup", data);

// export const loginUser = (data) => API.post("/login", data);

// export const verifyOtp = (data) => API.post("/verify-otp", data);

// export const resendOtp = (data) => API.post("/resend-otp", data);

// export const logoutUser = () => API.post("/logout");

// // USER APIs

// export const getProfile = () => API.get("/dashboard");

// export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://auth-app-uzjr.onrender.com/api/auth",
//   withCredentials: true, // 🔥 VERY IMPORTANT FOR COOKIES
// });

// // AUTH APIs


// export const signupUser = (data) => API.post("/signup", data);

// export const loginUser = (data) => API.post("/login", data);

// export const verifyOtp = (data) => API.post("/verify-otp", data);

// export const resendOtp = (data) => API.post("/resend-otp", data);

// export const logoutUser = () => API.post("/logout");


// // USER APIs


// export const getProfile = () => API.get("/dashboard");

// export default API;

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// ✅ MIDDLEWARES

app.use(express.json());
app.use(cookieParser());

// ✅ CORS CONFIG (PRODUCTION READY)

const allowedOrigins = [
  "https://auth-apx.netlify.app", // ✅ frontend deployed URL
  "http://localhost:5173", // ✅ local frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true, // ✅ VERY IMPORTANT FOR COOKIES

    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ✅ GLOBAL RESPONSE MIDDLEWARE

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

// ✅ ROUTES

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.success("API is running 🚀");
});

// ✅ DATABASE CONNECTION

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ✅ SERVER

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});