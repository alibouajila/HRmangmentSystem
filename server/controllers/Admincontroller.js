const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

// Function to generate access and refresh tokens
const generateTokens = (admin) => {
  const accessToken = jwt.sign(
    { id: admin._id, email: admin.email },
    "ali33ali",
    { expiresIn: "15m" } // Short expiration for security
  );

  const refreshToken = jwt.sign(
    { id: admin._id },
    "ali33ali",
    { expiresIn: "7d" } // Longer expiration
  );

  return { accessToken, refreshToken };
};

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if admin is verified
    if (!admin.isVerified) {
      return res.status(403).json({ message: "Admin not verified, please contact your supervisor" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(admin);

    res.status(200).json({ 
      message: "Admin logged in successfully", 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Refresh Token Route
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  // Use the same secret key as used in generateTokens()
  jwt.verify(refreshToken, "ali33ali", async (err, decoded) => { 
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: "Admin not found" });
    }

    // Generate new tokens
    const tokens = generateTokens(admin);
    res.json(tokens);
  });
};


// Get Admin Status
const getAdminStatus = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id); 
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ isVerified: admin.isVerified });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin status", error });
  }
};

module.exports = { registerAdmin, loginAdmin, refreshToken, getAdminStatus };
