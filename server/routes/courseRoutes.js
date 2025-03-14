const express = require("express");
const passport = require("passport");
const router = express.Router();
const Course = require("../models/Course"); // Make sure this is imported
const courseController = require("../controllers/courseController");

// GET /api/courses - Get all courses (Admins and Students)
router.get("/", passport.authenticate("jwt", { session: false }), courseController.getAllCourses);

// POST /api/courses - Admin only: Create course
router.post("/", passport.authenticate("jwt", { session: false }), courseController.createCourse);

// PUT /api/courses/:id - Admin only: Update course
router.put("/:id", passport.authenticate("jwt", { session: false }), courseController.updateCourse);

// DELETE /api/courses/:id - Admin only: Delete course
router.delete("/:id", passport.authenticate("jwt", { session: false }), courseController.deleteCourse);

router.post("/:id/register", passport.authenticate("jwt", { session: false }), courseController.registerForCourse);
router.post("/:id/unregister", passport.authenticate("jwt", { session: false }), courseController.unregisterFromCourse);

// -----------------------------
// Register a user to a course
// -----------------------------
// POST /api/courses/:id/register
exports.registerForCourse = async (req, res) => {
    try {
      // Determine userId: admin may pass a different id in the body
      const userId = req.user.role === "admin" ? req.body.userId : req.user._id;
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
  
      // Ensure studentsRegistered is defined
      if (!course.studentsRegistered) {
        course.studentsRegistered = [];
      }
  
      // Check capacity
      if (course.studentsRegistered.length >= course.capacity) {
        return res.status(400).json({ error: "Course is full" });
      }
  
      // Check for duplicate registration using .some() for proper ObjectId comparisons
      if (course.studentsRegistered.some(id => id && id.toString() === userId.toString())) {
        return res.status(400).json({ error: "User already registered" });
      }
  
      // Add user to the registration array and save the course
      course.studentsRegistered.push(userId);
      await course.save();
      res.json(course);
    } catch (error) {
      console.error("Error registering for course:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

// -----------------------------
// Unregister a user from a course
// -----------------------------
router.post("/:courseId/unregister", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { userId } = req.body;

  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) return res.status(404).json({ error: "Course not found" });

    course.studentsRegistered = course.studentsRegistered.filter(id => id.toString() !== userId);
    await course.save();

    const updatedCourse = await Course.findById(req.params.courseId).populate("studentsRegistered", "username email firstname lastname");
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error unregistering user:", error);
    res.status(500).json({ error: "Server error while unregistering user" });
  }
});

module.exports = router;
