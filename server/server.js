// server/server.js
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const databaseUrl = process.env.DATABASE_URL;

mongoose
  .connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const PORT = process.env.PORT || 3000;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});