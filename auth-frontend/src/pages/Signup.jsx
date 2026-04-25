import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     try {
  //       const res = await API.post("/signup", form);
  //       alert(res.data.message);
  //       window.location.href = "/verify-otp";

  //       // clear form after success
  //       setForm({
  //         name: "",
  //         email: "",
  //         password: "",
  //       });
  //     } catch (err) {
  //       alert(err.response?.data?.message || "Error");
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/signup", form);

      toast.success(res.data.message);

      // save email for OTP page (IMPORTANT)
      localStorage.setItem("email", form.email);

      // navigate properly
      navigate("/verify-otp");

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 px-4">
      <div className="bg-yellow-200 w-full max-w-sm p-8 rounded-2xl shadow-xl">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-green-900 mb-8">
          Sign Up
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            autoComplete="off"
            value={form.name}
            className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 text-green-900 placeholder-green-800 focus:bg-transparent"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            value={form.email}
            className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 text-green-900 placeholder-green-800 focus:bg-transparent"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 pr-10 text-green-900 placeholder-green-800 focus:bg-transparent"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {/* Eye Icon */}
            <span
              className="absolute right-2 top-2 cursor-pointer text-green-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Button */}
          <button className="bg-green-800 text-yellow-200 py-2 rounded-full mt-4 hover:bg-green-700 transition">
            Sign Up
          </button>

          <p className="text-sm text-center text-green-900 mt-4">
            Already have an account?
            <span
              className="cursor-pointer font-semibold ml-1"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
