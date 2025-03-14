const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// Middleware to ensure the requester is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Admins only." });
};

// PUT endpoint to promote a student to admin
router.put("/promote/:userId", 
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { role: "admin" },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error promoting user:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
