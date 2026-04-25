import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❌ if no token → redirect
    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ fetch profile
    const fetchProfile = async () => {
      try {
        const res = await API.get("/dashboard", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setUser(res.data.data); // because res.success()
      } catch (err) {
        console.log(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await API.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      toast.success("Logged out successfully");

      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 1000); // 👈 delay
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 px-4">
      <div className="bg-yellow-200 w-full max-w-md p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Dashboard</h2>

        {user ? (
          <div className="space-y-3 text-green-900">
            <p className="text-lg">
              👋 Welcome, <span className="font-semibold">{user.name}</span>
            </p>

            <p>Email: {user.email}</p>

            <p>
              Status:{" "}
              <span className="font-semibold">
                {user.isVerified ? "Verified ✅" : "Not Verified ❌"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-green-900">Loading...</p>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-green-800 text-yellow-200 py-2 px-6 rounded-full hover:bg-green-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
