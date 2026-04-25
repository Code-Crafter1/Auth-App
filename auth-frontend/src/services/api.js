import axios from "axios";

const API = axios.create({
  baseURL: "https://auth-app-uzjr.onrender.com/api/auth",
});

export default API;i