const Course = require("../models/Course");
const User = require("../models/User");

// GET /api/courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("studentsRegistered", "username");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, description, capacity } = req.body;
    const newCourse = new Course({
      title,
      description,
      capacity: capacity || 30,
      studentsRegistered: []
    });
    await newCourse.save();
    res.json(newCourse);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/courses/:id/register
exports.registerForCourse = async (req, res) => {
  try {
    // Admin or user
    // If admin, they can pass in userId in the body to register some other student
    // If student, they register themselves
    const userId = req.user.role === "admin" ? req.body.userId : req.user._id;

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Check capacity
    if (course.studentsRegistered.length >= course.capacity) {
      return res.status(400).json({ error: "Course is full" });
    }

    // Check if already registered
    if (course.studentsRegistered.includes(userId)) {
      return res.status(400).json({ error: "User already registered" });
    }

    course.studentsRegistered.push(userId);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/courses/:id/unregister
exports.unregisterFromCourse = async (req, res) => {
  try {
    const userId = req.user.role === "admin" ? req.body.userId : req.user._id;

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.studentsRegistered = course.studentsRegistered.filter(
      (studentId) => studentId.toString() !== userId.toString()
    );

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
