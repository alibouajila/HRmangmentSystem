const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // Initially set to false until verified
  },
});
  
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
