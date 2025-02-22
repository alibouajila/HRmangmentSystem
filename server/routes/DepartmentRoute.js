const express = require("express");
const { verifyToken } = require("../middlewares/auth.js");
const { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require("../controllers/departmentController.js");

const router = express.Router();

//  (Admin Only)
router.post("/", verifyToken, createDepartment);

router.get("/", verifyToken, getDepartments);

router.get("/:id", verifyToken, getDepartmentById);

router.put("/:id", verifyToken, updateDepartment);

router.delete("/:id", verifyToken, deleteDepartment);

module.exports = router;
