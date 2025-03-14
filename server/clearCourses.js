require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");

// Connect to MongoDB (make sure DATABASE_URL is set in your .env)
mongoose.connect(process.env.DATABASE_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log("Connected to MongoDB");
  
  // Remove all courses
  await Course.deleteMany({});
  console.log("Courses cleared!");

  mongoose.connection.close();
})
.catch(err => {
  console.error("Error connecting to MongoDB", err);
});
