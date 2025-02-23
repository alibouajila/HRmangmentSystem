// controllers/adminController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin"); // Import your Admin model

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
    res.status(201).send({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error registering admin", error });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Check if admin is verified
    if (!admin.isVerified) {
      return res.status(403).send({ message: "Admin not verified" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      "ali33ali",
      { expiresIn: "1h" }
    );

    res.status(200).send({ message: "Admin logged in successfully", token });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error });
  }
};

// Get Admin Status (e.g., whether the admin is verified or not)
const getAdminStatus = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId); 
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({ isVerified: admin.isVerified });
  } catch (error) {
    res.status(500).send({ message: "Error fetching admin status", error });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdminStatus };
