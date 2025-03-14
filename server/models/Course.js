const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  string_id: String,
  title: String,
  description: String,
  schedule: String, // Ensure this is included
  classroom_number: String,
  capacity: Number,
  credit_hours: Number,
  tuition_cost: Number,
  studentsRegistered: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});


module.exports = mongoose.model("Course", courseSchema);
