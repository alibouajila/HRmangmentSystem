const express = require("express");
const { verifyToken } = require("../middlewares/auth");  // Import middleware for verifying token
const { registerAdmin, loginAdmin, getAdminStatus,refreshToken } = require("../controllers/Admincontroller");  // Import controllers
const router = express.Router();

// Admin registration route
router.post("/register", registerAdmin);

// Admin login route
router.post("/login", loginAdmin);
//refresh token route
router.post("/refresh-token", refreshToken);
// Route to get admin's status (e.g., verify if the admin is verified)
router.get("/status", verifyToken, getAdminStatus);

module.exports = router;
