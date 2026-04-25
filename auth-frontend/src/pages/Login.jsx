import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import API from "../services/api";
import { toast } from "react-toastify";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const res = await API.post("/login", form);
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.data.token);

      toast.info(res.data.message);

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 px-4">
      <div className="bg-yellow-200 w-full max-w-sm p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-8">
          Login Now
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 text-green-900"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 pr-10 text-green-900"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <span
              className="absolute right-2 top-2 cursor-pointer text-green-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="bg-green-800 text-yellow-200 py-2 rounded-full mt-4 hover:bg-green-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
