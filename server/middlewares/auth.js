import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Middleware to verify JWT token and check if the admin is verified
export const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from the Authorization header
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "ali33ali");

    // Check if the admin is verified
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isVerified) {
      return res.status(403).json({ message: "Access denied. Admin not verified." });
    }

    req.admin = admin; // Attach the admin to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
