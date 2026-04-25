// const jwt = require("jsonwebtoken");
// const Session = require("../models/Session");

// const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.error("No token, access denied", 401);
//     }

//     const parts = authHeader.split(" ");

//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//       return res.error("Invalid token format", 401);
//     }

//     const token = parts[1];

//     // ✅ verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ check session in DB
//     const session = await Session.findOne({ token });

//     if (!session) {
//       return res.error("Session expired or logged out", 401);
//     }

//     // ✅ optional: check expiry manually (extra safety)
//     if (session.expiresAt < Date.now()) {
//       await Session.deleteOne({ token });
//       return res.error("Session expired. Please login again", 401);
//     }

//     req.user = { id: decoded.id };

//     next();
//   } catch (err) {
//     return res.error("Invalid or expired token", 401);
//   }
// };

// module.exports = protect;

const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ 1. CHECK COOKIE FIRST
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // ✅ 2. FALLBACK TO HEADER
    else if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts[0] === "Bearer" && parts[1]) {
        token = parts[1];
      }
    }

    // ❌ NO TOKEN
    if (!token) {
      return res.error("No token, access denied", 401);
    }

    // ✅ VERIFY JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ CHECK SESSION
    const session = await Session.findOne({ token });

    if (!session) {
      return res.error("Session expired or logged out", 401);
    }

    // ✅ CHECK EXPIRY
    if (session.expiresAt < Date.now()) {
      await Session.deleteOne({ token });
      return res.error("Session expired. Please login again", 401);
    }

    // ✅ ATTACH USER
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.error("Invalid or expired token", 401);
  }
};

module.exports = protect;
