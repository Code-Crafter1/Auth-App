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

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔥 VERY IMPORTANT FOR COOKIES
});

API.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH APIs

export const signupUser = (data) => API.post("/api/auth/signup", data);

export const loginUser = (data) => API.post("/api/auth/login", data);

export const verifyOtp = (data) => API.post("/api/auth/verify-otp", data);

export const resendOtp = (data) => API.post("/api/auth/resend-otp", data);

export const logoutUser = () => API.post("/api/auth/logout", data);

// USER APIs

export const getProfile = () => API.get("/api/auth/dashboard");

export default API;
