const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const router = express.Router();

// Define the upload directory relative to the server root
const uploadDir = path.join(__dirname, "../uploads");

// Ensure that the uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads folder:", uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// POST endpoint for uploading a profile image
router.post("/profile-image/:userId", upload.single("image"), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Log the file details for debugging
    console.log("Uploaded file:", req.file);
    
    // Build the path that will be saved in the database (adjust as needed)
    const imagePath = `/uploads/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profileImageUrl: imagePath },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Image upload failed." });
  }
});

// DELETE endpoint for deleting a profile image
router.delete("/profile-image/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.profileImageUrl) {
      return res.status(400).json({ error: "No image to delete" });
    }
    // Build the absolute file path
    const filePath = path.join(__dirname, "../", user.profileImageUrl);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file", err);
        return res.status(500).json({ error: "Failed to delete file" });
      }
      user.profileImageUrl = "";
      await user.save();
      res.json(user);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
