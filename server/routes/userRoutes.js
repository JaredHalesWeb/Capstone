const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");

// GET /api/users
// For admins to list all users, or self to get own details, etc.
router.get("/", passport.authenticate("jwt", { session: false }), userController.getAllUsers);

// GET /api/users/:id
router.get("/:id", passport.authenticate("jwt", { session: false }), userController.getUserById);

// PUT /api/users/:id
// Admin or the user themself can update
router.put("/:id", passport.authenticate("jwt", { session: false }), userController.updateUser);

// DELETE /api/users/:id
// Admin can delete user
router.delete("/:id", passport.authenticate("jwt", { session: false }), userController.deleteUser);

module.exports = router;
