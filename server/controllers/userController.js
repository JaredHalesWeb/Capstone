const User = require("../models/User");

// GET /api/users
exports.getAllUsers = async (req, res) => {
  const search = req.query.search || "";
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const users = await User.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } }
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    // Admin or user themself
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { email, firstname, lastname, telephone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, firstname, lastname, telephone, address },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
