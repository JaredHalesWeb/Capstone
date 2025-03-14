const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  schedule: String,
  classroom_number: String,
  capacity: Number,
  credit_hours: Number,
  tuition_cost: Number,
  studentsRegistered: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] }
});

module.exports = mongoose.model("Course", courseSchema);
