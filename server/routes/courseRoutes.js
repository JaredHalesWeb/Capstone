const express = require("express");
const passport = require("passport");
const router = express.Router();
const courseController = require("../controllers/courseController");

// GET /api/courses
router.get("/", passport.authenticate("jwt", { session: false }), courseController.getAllCourses);

// POST /api/courses
// Admin only
router.post("/", passport.authenticate("jwt", { session: false }), courseController.createCourse);

// PUT /api/courses/:id
// Admin can edit
router.put("/:id", passport.authenticate("jwt", { session: false }), courseController.updateCourse);

// DELETE /api/courses/:id
// Admin can delete
router.delete("/:id", passport.authenticate("jwt", { session: false }), courseController.deleteCourse);

// POST /api/courses/:id/register
// Student or Admin
router.post("/:id/register", passport.authenticate("jwt", { session: false }), courseController.registerForCourse);

// POST /api/courses/:id/unregister
router.post("/:id/unregister", passport.authenticate("jwt", { session: false }), courseController.unregisterFromCourse);

module.exports = router;
