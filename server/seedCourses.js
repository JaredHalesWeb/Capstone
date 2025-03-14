require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Course = require("./models/Course"); // Ensure this path is correct

// Connect to MongoDB using your DATABASE_URL from your .env file
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB. Seeding courses...");
    seedCourses();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

function seedCourses() {
  const courses = [];

  // Update the path to where your CSV file is located (for example, in a folder called data)
  fs.createReadStream("./data/coursedata.csv")
    .pipe(csv())
    .on("data", (row) => {
      // The CSV columns are:
      // string_id,title,description,schedule,classroom_number,maximum_capacity,credit_hours,tuition_cost
      courses.push({
        string_id: row.string_id,
        title: row.title,
        description: row.description,
        schedule: row.schedule,
        classroom_number: row.classroom_number,
        capacity: Number(row.maximum_capacity),
        credit_hours: Number(row.credit_hours),
        tuition_cost: Number(row.tuition_cost),
      });
    })
    .on("end", async () => {
      try {
        await Course.insertMany(courses);
        console.log("Courses seeded successfully!");
        process.exit(0);
      } catch (err) {
        console.error("Error seeding courses:", err);
        process.exit(1);
      }
    });
}
