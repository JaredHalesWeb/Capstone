import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "courses"
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // stores a user object currently being edited
  const [editingCourse, setEditingCourse] = useState(null); // stores a course object currently being edited

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchCourses();
    }
    // eslint-disable-next-line
  }, [activeTab, searchTerm]);

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

  // --- User Editing Handlers ---
  const handleUserEdit = (user) => {
    setEditingUser(user);
  };

  const handleUserCancel = () => {
    setEditingUser(null);
  };

  const handleUserSave = async () => {
    try {
      const res = await axios.put(`/api/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: token },
      });
      setUsers(users.map(u => (u._id === res.data._id ? res.data : u)));
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: token },
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // --- Course Editing Handlers ---
  const handleCourseEdit = (course) => {
    setEditingCourse(course);
  };

  const handleCourseCancel = () => {
    setEditingCourse(null);
  };

  const handleCourseSave = async () => {
    try {
      const res = await axios.put(`/api/courses/${editingCourse._id}`, editingCourse, {
        headers: { Authorization: token },
      });
      setCourses(courses.map(c => (c._id === res.data._id ? res.data : c)));
      setEditingCourse(null);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleCourseDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }
    try {
      await axios.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: token },
      });
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      
      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "users" ? styles.activeTab : styles.tab}
          onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
        >
          Users
        </button>
        <button
          style={activeTab === "courses" ? styles.activeTab : styles.tab}
          onClick={() => { setActiveTab("courses"); setSearchTerm(""); }}
        >
          Courses
        </button>
      </div>
      
      {/* Search */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      {/* List Display */}
      {activeTab === "users" ? (
        <div style={styles.listContainer}>
          {users.map((user) => (
            <div key={user._id} style={styles.listItem}>
              {editingUser && editingUser._id === user._id ? (
                <div style={styles.editForm}>
                  <input 
                    type="text" 
                    value={editingUser.username} 
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    style={styles.inputField}
                  />
                  <input 
                    type="email" 
                    value={editingUser.email} 
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    style={styles.inputField}
                  />
                  <input 
                    type="text" 
                    value={editingUser.firstname} 
                    onChange={(e) => setEditingUser({ ...editingUser, firstname: e.target.value })}
                    style={styles.inputField}
                  />
                  <input 
                    type="text" 
                    value={editingUser.lastname} 
                    onChange={(e) => setEditingUser({ ...editingUser, lastname: e.target.value })}
                    style={styles.inputField}
                  />
                  <div>
                    <button onClick={handleUserSave} style={styles.actionButton}>Save</button>
                    <button onClick={handleUserCancel} style={styles.cancelButton}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p>
                      <strong>{user.username}</strong> - {user.email} ({user.role})
                    </p>
                    <p>{user.firstname} {user.lastname}</p>
                  </div>
                  <div>
                    <button onClick={() => handleUserEdit(user)} style={styles.actionButton}>
                      Edit
                    </button>
                    <button onClick={() => handleUserDelete(user._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.listContainer}>
          {courses.map((course) => (
            <div key={course._id} style={styles.listItem}>
              {editingCourse && editingCourse._id === course._id ? (
                <div style={styles.editForm}>
                  <input 
                    type="text" 
                    value={editingCourse.title} 
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    style={styles.inputField}
                  />
                  <input 
                    type="text" 
                    value={editingCourse.description} 
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    style={styles.inputField}
                  />
                  <input 
                    type="text" 
                    value={editingCourse.schedule} 
                    onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                    style={styles.inputField}
                  />
                  <input 
                    type="number" 
                    value={editingCourse.capacity} 
                    onChange={(e) => setEditingCourse({ ...editingCourse, capacity: Number(e.target.value) })}
                    style={styles.inputField}
                  />
                  <div>
                    <button onClick={handleCourseSave} style={styles.actionButton}>Save</button>
                    <button onClick={handleCourseCancel} style={styles.cancelButton}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p>
                      <strong>{course.title}</strong>
                    </p>
                    <p>{course.description}</p>
                    <p>
                      Schedule: {course.schedule} | Capacity: {course.studentsRegistered?.length || 0}/{course.capacity}
                    </p>
                  </div>
                  <div>
                    <button onClick={() => handleCourseEdit(course)} style={styles.actionButton}>
                      Edit
                    </button>
                    <button onClick={() => handleCourseDelete(course._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                </>
              )}
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
    margin: "100px auto 2rem auto", // extra top margin for fixed nav bar
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
  cancelButton: {
    padding: "0.4rem 0.8rem",
    marginRight: "0.5rem",
    backgroundColor: "#6c757d",
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
  editForm: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "0.5rem",
  },
  inputField: {
    padding: "0.4rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
};

export default AdminDashboard;
