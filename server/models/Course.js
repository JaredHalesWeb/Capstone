const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  capacity: Number, // how many students can register
  studentsRegistered: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  // Add more fields as needed, e.g. creditHours, tuition, etc.
});

module.exports = mongoose.model("Course", courseSchema);
