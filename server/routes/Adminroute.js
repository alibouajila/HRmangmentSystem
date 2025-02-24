const express = require("express");
const { verifyToken } = require("../middlewares/auth");  // Import middleware for verifying token
const { registerAdmin, loginAdmin, getAdminStatus } = require("../controllers/Admincontroller");  // Import controllers

const router = express.Router();

// Admin registration route
router.post("/register", registerAdmin);

// Admin login route
router.post("/login", loginAdmin);

// Route to get admin's status (e.g., verify if the admin is verified)
router.get("/status", verifyToken, getAdminStatus);

module.exports = router;
