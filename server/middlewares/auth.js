const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Secret keys
const ACCESS_SECRET = "ali33ali";
const REFRESH_SECRET = "ali33ali"; // Fixed: Using the same secret

// Middleware to verify JWT token and refresh if expired
const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const refreshToken = req.header("x-refresh-token"); // Get refresh token from header

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    // Verify the access token
    const decoded = jwt.verify(token, ACCESS_SECRET);

    // Check if the admin is verified
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isVerified) {
      return res.status(403).json({ message: "Access denied. Admin not verified." });
    }

    req.admin = admin; // Attach admin to request
    return next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      if (!refreshToken) {
        return res.status(401).json({ message: "Token expired. Refresh token required." });
      }

      try {
        // Verify refresh token
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
        const admin = await Admin.findById(decodedRefresh.id);

        if (!admin) {
          return res.status(403).json({ message: "Admin not found." });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign({ id: admin._id, email: admin.email }, ACCESS_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jwt.sign({ id: admin._id }, REFRESH_SECRET, { expiresIn: "7d" });

        // Send new tokens in headers
        res.setHeader("x-access-token", newAccessToken);
        res.setHeader("x-refresh-token", newRefreshToken);

        req.admin = admin;
        return next(); // Proceed to request
      } catch (refreshError) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
      }
    }

    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = { verifyToken };
