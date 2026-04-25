// import { useEffect, useRef, useState } from "react";
// import API from "../services/api";
// import { toast } from "react-toastify";

// export default function VerifyOtp() {
//   // const [email, setEmail] = useState("");
//   const [email, setEmail] = useState(localStorage.getItem("email") || "");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputsRef = useRef([]);

//   const [timer, setTimer] = useState(30);

//   // ⏱️ TIMER LOGIC
//   useEffect(() => {
//     if (timer === 0) return;

//     const interval = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   // OTP INPUT HANDLER
//   const handleChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1].focus();
//     }
//   };

//   // BACKSPACE HANDLER
//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1].focus();
//     }
//   };

//   // VERIFY OTP
//   const handleVerify = async (e) => {
//     e.preventDefault();

//     const finalOtp = otp.join("");

//     try {
//       const res = await API.post("/verify-otp", {
//         email,
//         otp: finalOtp,
//       });

//       toast.success(res.data.message);
//       window.location.href = "/login";
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   // RESEND OTP
//   const handleResend = async () => {
//     try {
//       const res = await API.post("/resend-otp", { email });

//       alert(res.data.message);
//       setTimer(30); // reset timer
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-900 px-4">
//       <div className="bg-yellow-200 w-full max-w-sm p-8 rounded-2xl shadow-xl">
//         <h2 className="text-2xl font-bold text-center text-green-900 mb-6">
//           Verify OTP
//         </h2>

//         <form onSubmit={handleVerify} className="flex flex-col gap-6">
//           {/* Email */}
//           {/* <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 text-green-900"
//             onChange={(e) => setEmail(e.target.value)}
//           /> */}
//           <input
//             type="email"
//             value={email}
//             readOnly
//             className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 text-green-900"
//           />

//           {/* OTP HEADING */}
//           <p className="text-green-900 text-sm text-left px-3">
//             Enter OTP sent to your email..
//           </p>

//           {/* OTP BOXES */}
//           <div className="flex justify-center gap-2 ">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 maxLength="1"
//                 value={digit}
//                 ref={(el) => (inputsRef.current[index] = el)}
//                 onChange={(e) => handleChange(e.target.value, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//                 className="w-10 h-10 text-center text-lg font-semibold
//                            border border-green-800 rounded-md
//                            bg-white text-green-900 outline-none"
//               />
//             ))}
//           </div>

//           {/* TIMER + RESEND */}
//           <div className="text-center text-sm text-green-900">
//             {timer > 0 ? (
//               <p>Resend OTP in {timer}s</p>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleResend}
//                 className="underline font-semibold"
//               >
//                 Resend OTP
//               </button>
//             )}
//           </div>

//           {/* Button */}
//           <button className="bg-green-800 text-yellow-200 py-2 rounded-full mt-2 hover:bg-green-700 transition">
//             Verify OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resendOtp, verifyOtp } from "../services/api";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [email] = useState(localStorage.getItem("email") || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(30);

  // ⏱️ TIMER
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ VERIFY
  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    try {
      const res = await verifyOtp({ email, otp: finalOtp });

      toast.success(res.data.message);

      localStorage.removeItem("email");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  // ✅ RESEND
  const handleResend = async () => {
    try {
      const res = await resendOtp({ email });

      toast.success(res.data.message);
      setTimer(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 px-4">
      <div className="bg-yellow-200 w-full max-w-sm p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <input
            type="email"
            value={email}
            readOnly
            className="w-full bg-transparent border-b-2 border-green-800 outline-none py-2 px-3 text-green-900"
          />

          <p className="text-green-900 text-sm text-left px-3">
            Enter OTP sent to your email..
          </p>

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 text-center text-lg font-semibold border border-green-800 rounded-md bg-white text-green-900 outline-none"
              />
            ))}
          </div>

          <div className="text-center text-sm text-green-900">
            {timer > 0 ? (
              <p>Resend OTP in {timer}s</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="underline font-semibold"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button className="bg-green-800 text-yellow-200 py-2 rounded-full mt-2 hover:bg-green-700 transition">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
