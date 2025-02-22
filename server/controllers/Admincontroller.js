// controllers/adminController.js

const Admin = require("../models/Admin"); // Import your Admin model

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new admin (you should hash the password here)
    const admin = new Admin({
      username,
      email,
      password,
    });

    await admin.save();
    res.status(201).send({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error registering admin", error });
  }
};

// Login Admin (Dummy logic for now, should include password hash check)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Send a token or other authentication logic here (JWT)
    res.status(200).send({ message: "Admin logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error });
  }
};

// Get Admin Status (e.g., whether the admin is verified or not)
const getAdminStatus = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId); // Assuming adminId is provided by the token
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({ isVerified: admin.isVerified });
  } catch (error) {
    res.status(500).send({ message: "Error fetching admin status", error });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdminStatus };
