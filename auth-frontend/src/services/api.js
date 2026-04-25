// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://auth-app-uzjr.onrender.com/api/auth",
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://auth-app-uzjr.onrender.com/api/auth",
});

//  Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  AUTH APIs

export const signupUser = (data) => API.post("/signup", data);

export const loginUser = (data) => API.post("/login", data);

export const verifyOtp = (data) => API.post("/verify-otp", data);

export const resendOtp = (data) => API.post("/resend-otp", data);

export const logoutUser = () => API.post("/logout");

// USER APIs

export const getProfile = () => API.get("/dashboard");

export default API;
