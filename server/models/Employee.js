const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // Reference to department
  salary: { type: Number, required: true },
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
