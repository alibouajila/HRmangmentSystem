const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }] // Array of employee references
}, { timestamps: true });

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
