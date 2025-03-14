const Course = require("../models/Course");
const User = require("../models/User");

// GET /api/courses - supports search filtering
exports.getAllCourses = async (req, res) => {
  const search = req.query.search || "";
  try {
    const courses = await Course.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }).populate("studentsRegistered", "username email firstname lastname");
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/courses - Admin only: Create course
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { title, description, capacity, schedule } = req.body;
    const newCourse = new Course({
      title,
      description,
      schedule,
      capacity: capacity || 30,
      studentsRegistered: []
    });
    await newCourse.save();
    res.json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/courses/:id - Admin only: Update course
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
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/courses/:id - Admin only: Delete course
exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/courses/:id/register - Register a user to a course
exports.registerForCourse = async (req, res) => {
  try {
    // Determine which user to register: if admin, use req.body.userId; otherwise use req.user._id
    const userId = req.user.role === "admin" ? req.body.userId : req.user._id;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Check if course is full
    if (course.studentsRegistered.length >= course.capacity) {
      return res.status(400).json({ error: "Course is full" });
    }

    // Check for duplicate registration using .some() to compare ObjectIds as strings
    if (course.studentsRegistered.some(id => id.toString() === userId.toString())) {
      return res.status(400).json({ error: "User already registered" });
    }

    course.studentsRegistered.push(userId);
    await course.save();
    res.json(course);
  } catch (error) {
    console.error("Error registering for course:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/courses/:id/unregister - Unregister a user from a course
exports.unregisterFromCourse = async (req, res) => {
  try {
    const userId = req.user.role === "admin" ? req.body.userId : req.user._id;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.studentsRegistered = course.studentsRegistered.filter(
      studentId => studentId.toString() !== userId.toString()
    );
    await course.save();
    res.json(course);
  } catch (error) {
    console.error("Error unregistering from course:", error);
    res.status(500).json({ error: "Server error" });
  }
};
