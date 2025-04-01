import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "courses"
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState(null);
  const [newStudentId, setNewStudentId] = useState("");
  const token = localStorage.getItem("token");

  // Helper function to convert image data (an array) to a base64 string
  const convertImageDataToBase64 = (data) => {
    if (typeof data === "string") return data; // already a string
    if (Array.isArray(data)) {
      const binaryString = data.map((byte) => String.fromCharCode(byte)).join("");
      return btoa(binaryString);
    }
    if (typeof data === "object" && data.data && Array.isArray(data.data)) {
      const binaryString = data.data.map((byte) => String.fromCharCode(byte)).join("");
      return btoa(binaryString);
    }
    return "";
  };

  const getImageUrl = (user) => {
    const placeholder = "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk";
    if (user && user.profileImage && user.profileImage.data) {
      const base64String = convertImageDataToBase64(user.profileImage.data);
      if (base64String) {
        return `data:${user.profileImage.contentType};base64,${base64String}`;
      }
    }
    return placeholder;
  };

  const handleRemoveProfileImage = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user's profile image?")) return;
    try {
      const res = await axios.delete(`/api/upload/profile-image/${userId}`, {
        headers: { Authorization: token },
      });
      setUsers(users.map(u => (u._id === res.data._id ? res.data : u)));
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchCourses();
    }
    // Clear any enrollment selection when switching tabs
    setSelectedCourseForEnrollment(null);
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

  // --- User Handlers ---
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

  // --- Course Handlers ---
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

  // --- Enrollment Handlers ---
  const handleOpenEnrollment = (course) => {
    setSelectedCourseForEnrollment(course);
  };

  const handleCloseEnrollment = () => {
    setSelectedCourseForEnrollment(null);
    setNewStudentId("");
  };

  const handleRemoveStudent = async (courseId, studentId) => {
    if (!window.confirm("Are you sure you want to remove this student from the course?")) {
      return;
    }
    try {
      await axios.post(`/api/courses/${courseId}/unregister`, { userId: studentId }, {
        headers: { Authorization: token },
      });
      fetchCourses();
      if (selectedCourseForEnrollment && selectedCourseForEnrollment._id === courseId) {
        const updatedCourse = {
          ...selectedCourseForEnrollment,
          studentsRegistered: selectedCourseForEnrollment.studentsRegistered.filter(s => s._id !== studentId)
        };
        setSelectedCourseForEnrollment(updatedCourse);
      }
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  const handleAddStudent = async (courseId) => {
    if (!newStudentId) return;
    try {
      await axios.post(`/api/courses/${courseId}/register`, { userId: newStudentId }, {
        headers: { Authorization: token },
      });
      fetchCourses();
      const course = courses.find(c => c._id === courseId);
      if (course) {
        setSelectedCourseForEnrollment(course);
      }
      setNewStudentId("");
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // --- Promotion Handler ---
  const handlePromote = async (userId) => {
    if (!window.confirm("Are you sure you want to promote this user to admin?")) return;
    try {
      const res = await axios.put(`/api/admin/promote/${userId}`, {}, {
        headers: { Authorization: token },
      });
      setUsers(users.map(u => (u._id === res.data._id ? res.data : u)));
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  };

  return (
    <>
      <style>{`
        .smallProfileImage {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
        }

        .smallProfileImage:hover {
          transform: scale(2); /* Increased the scale factor */
        }

        .removeText {
          font-size: 0.65rem;    /* Smaller text */
          color: #888;
          margin-top: 0.1rem;
          text-align: center;
          display: block;        /* Ensure it's block-level */
          width: 40px;           /* Match the image width */
          margin: 0.1rem auto 0;  /* Center it under the image */
        }
      `}</style>
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <img
                          src={getImageUrl(user)}
                          alt="pfp"
                          className="smallProfileImage"
                          onClick={() => handleRemoveProfileImage(user._id)}
                          title="Click to remove profile image"
                        />
                        <p className="removeText">Click pfp to remove</p>
                      </div>
                      <div style={{ marginLeft: "0.5rem" }}>
                        <p>
                          <strong>{user.username}</strong> - {user.email} ({user.role})
                        </p>
                        <p>{user.firstname} {user.lastname}</p>
                        <p style={{ fontSize: "0.8rem", color: "#555" }}>ID: {user._id}</p>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => handleUserEdit(user)} style={styles.actionButton}>
                        Edit
                      </button>
                      <button onClick={() => handleUserDelete(user._id)} style={styles.deleteButton}>
                        Delete
                      </button>
                      {user.role !== "admin" && (
                        <button onClick={() => handlePromote(user._id)} style={styles.promoteButton}>
                          Promote
                        </button>
                      )}
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
                      <button onClick={() => handleOpenEnrollment(course)} style={styles.enrollmentButton}>
                        Manage Enrollment
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {/* Modal Overlay for Enrollment Management */}
            {selectedCourseForEnrollment && (
              <div style={modalStyles.overlay}>
                <div style={modalStyles.modal}>
                  <h3>Manage Enrollment for {selectedCourseForEnrollment.title}</h3>
                  <div>
                    <p><strong>Enrolled Students:</strong></p>
                    <ul style={styles.enrollmentList}>
                      {selectedCourseForEnrollment.studentsRegistered && selectedCourseForEnrollment.studentsRegistered.length > 0 ? (
                        selectedCourseForEnrollment.studentsRegistered.map((student) => (
                          <li key={student._id} style={styles.enrollmentListItem}>
                            <span>{student.username}</span>
                            <button
                              onClick={() => handleRemoveStudent(selectedCourseForEnrollment._id, student._id)}
                              style={styles.deleteButton}
                            >
                              Remove
                            </button>
                          </li>
                        ))
                      ) : (
                        <li>No students enrolled.</li>
                      )}
                    </ul>
                  </div>
                  <div style={styles.addStudentContainer}>
                    <input
                      type="text"
                      placeholder="Enter student ID"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      style={styles.searchInput}
                    />
                    <button onClick={() => handleAddStudent(selectedCourseForEnrollment._id)} style={styles.actionButton}>
                      Add Student
                    </button>
                  </div>
                  <button onClick={handleCloseEnrollment} style={styles.cancelButton}>
                    Close Enrollment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// Main styles for dashboard
const styles = {
  container: {
    maxWidth: "800px",
    margin: "100px auto 2rem auto", // extra top margin for fixed nav bar
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", marginBottom: "1rem", fontSize: "2rem" },
  tabContainer: { display: "flex", justifyContent: "center", marginBottom: "1rem" },
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
  searchContainer: { textAlign: "center", marginBottom: "1rem" },
  searchInput: {
    padding: "0.5rem",
    width: "80%",
    maxWidth: "400px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  listContainer: { marginTop: "1rem" },
  listItem: {
    padding: "1rem",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallProfileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
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
  promoteButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "0.5rem",
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
  enrollmentButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#ffc107", // yellow-ish
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  enrollmentList: { listStyle: "none", padding: 0 },
  enrollmentListItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #ddd",
  },
  addStudentContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "1rem",
  },
};

// Modal overlay styles for enrollment management
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
};

export default AdminDashboard;
