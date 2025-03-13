import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "courses"
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/users?search=${searchTerm}`, {
        headers: { Authorization: token },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`/api/courses?search=${searchTerm}`, {
        headers: { Authorization: token },
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchCourses();
    }
  }, [activeTab, searchTerm]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "users" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          style={activeTab === "courses" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("courses")}
        >
          Courses
        </button>
      </div>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      {activeTab === "users" ? (
        <div style={styles.listContainer}>
          {users.map((user) => (
            <div key={user._id} style={styles.listItem}>
              <div>
                <p>
                  <strong>{user.username}</strong> - {user.email} ({user.role})
                </p>
              </div>
              <div>
                <button style={styles.actionButton}>Edit</button>
                <button style={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.listContainer}>
          {courses.map((course) => (
            <div key={course._id} style={styles.listItem}>
              <div>
                <p>
                  <strong>{course.title}</strong>
                </p>
                <p>{course.description || "No description"}</p>
                <p>
                  Capacity: {course.studentsRegistered.length}/{course.capacity}
                </p>
              </div>
              <div>
                <button style={styles.actionButton}>Edit</button>
                <button style={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
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
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  tab: {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    marginRight: "0.5rem",
    borderRadius: "4px",
  },
  activeTab: {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    border: "1px solid #007bff",
    backgroundColor: "#007bff",
    color: "#fff",
    marginRight: "0.5rem",
    borderRadius: "4px",
  },
  searchContainer: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  searchInput: {
    padding: "0.5rem",
    width: "80%",
    maxWidth: "400px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  listContainer: {
    marginTop: "1rem",
  },
  listItem: {
    padding: "1rem",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    padding: "0.4rem 0.8rem",
    marginRight: "0.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
