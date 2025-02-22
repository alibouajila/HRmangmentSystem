import Department from "../models/Department.js";

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    // Create a new department
    const newDepartment = new Department({ name, description });
    await newDepartment.save();

    res.status(201).json({ message: "Department created successfully", department: newDepartment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a department
export const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated successfully", department: updatedDepartment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
