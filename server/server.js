require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const express = require("express");
const morgan = require("morgan"); // or Winston
const passport = require("passport");

// Connect to Database
// (If MongoDB)
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const uploadRoutes = require("./routes/upload");
const adminRoutes = require("./routes/admin");

// Passport config
require("./config/passport")(passport);

const PORT = process.env.PORT || 3000;

const app = express();

// Logging
app.use(morgan("dev")); // For more advanced logging, consider Winston

// JSON Body Parser
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// Example: All routes prefixed with /api
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Serve React/Vue app
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Catch-all to handle SPA (client side routing)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
