const express = require("express");
const { verifyToken } = require("../middlewares/auth.js");
const { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require("../controllers/employeeController.js");

const router = express.Router();

// Create a new employee
router.post("/", verifyToken, createEmployee);

// Get all employees
router.get("/", verifyToken, getEmployees);

// Get an employee by ID
router.get("/:id", verifyToken, getEmployeeById);

// Update an employee's information
router.put("/:id", verifyToken, updateEmployee);

// Delete an employee
router.delete("/:id", verifyToken, deleteEmployee);

module.exports = router;
