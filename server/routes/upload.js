const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const router = express.Router();

// Use memoryStorage if you're storing image data in MongoDB
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST endpoint for uploading profile image (unchanged)
router.post("/profile-image/:userId", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    await user.save();
    const userObj = user.toObject();
    if (userObj.profileImage && userObj.profileImage.data) {
      userObj.profileImage.data = userObj.profileImage.data.toString("base64");
    }
    res.status(200).json(userObj);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Image upload failed." });
  }
});

// DELETE endpoint for deleting profile image
router.delete("/profile-image/:userId", async (req, res) => {
  try {
    // Here we don't restrict removal—admins can remove any user's image,
    // and a user can remove their own image.
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profileImage: null },
      { new: true }
    ).lean();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Image deletion failed." });
  }
});

module.exports = router;
