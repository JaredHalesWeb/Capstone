import React, { useEffect, useState } from "react";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses", {
        headers: { Authorization: token },
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleRegister = async (courseId) => {
    try {
      await axios.post(`/api/courses/${courseId}/register`, {}, {
        headers: { Authorization: token },
      });
      fetchCourses();
    } catch (error) {
      alert("Registration failed: " + error.response.data.error);
    }
  };

  const handleUnregister = async (courseId) => {
    try {
      await axios.post(`/api/courses/${courseId}/unregister`, {}, {
        headers: { Authorization: token },
      });
      fetchCourses();
    } catch (error) {
      alert("Unregistration failed: " + error.response.data.error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Available Courses</h2>
      <ul style={styles.list}>
        {courses.map((course) => {
          const isRegistered = course.studentsRegistered.some(
            (student) => student._id === localUser.id
          );
          return (
            <li key={course._id} style={styles.listItem}>
              <div style={styles.courseInfo}>
                <strong>{course.title}</strong>
                <p>{course.description || "No description"}</p>
                <p>
                  Capacity: {course.studentsRegistered.length} / {course.capacity}
                </p>
              </div>
              <div>
                {isRegistered ? (
                  <button
                    onClick={() => handleUnregister(course._id)}
                    style={styles.unregisterButton}
                  >
                    Unregister
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(course._id)}
                    style={styles.registerButton}
                  >
                    Register
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "2rem",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid #eee",
  },
  courseInfo: {
    flex: 1,
  },
  registerButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  unregisterButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Courses;
