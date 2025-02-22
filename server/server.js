const express = require("express");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/Adminroute");
const departmentRoutes = require("./routes/DepartmentRoute");
const employeeRoutes = require("./routes/Employee");

// Create an express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/", {
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Use routes
app.use("/admin", adminRoutes); // Admin routes
app.use("/departments", departmentRoutes); // Department routes
app.use("/employees", employeeRoutes); // Employee routes

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
