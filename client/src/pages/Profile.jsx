import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const token = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${localUser.id}`, {
          headers: { Authorization: token },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await axios.get(`/api/courses`, {
          headers: { Authorization: token },
        });
        const filtered = res.data.filter((course) =>
          course.studentsRegistered.some(
            (student) => student._id === localUser.id
          )
        );
        setRegisteredCourses(filtered);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };

    fetchProfile();
    fetchCourses();
  }, [token, localUser.id]);

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <img 
          src="https://via.placeholder.com/150" 
          alt="Profile" 
          style={styles.profileImage}
        />
        {user && (
          <div style={styles.basicInfo}>
            <h2 style={styles.name}>
              {user.firstname} {user.lastname}
            </h2>
            <p style={styles.username}>@{user.username}</p>
            <p style={styles.email}>{user.email}</p>
          </div>
        )}
      </div>
      
      <div style={styles.detailsSection}>
        <h3 style={styles.sectionTitle}>Contact Information</h3>
        {user && (
          <div>
            <p><strong>Telephone:</strong> {user.telephone}</p>
            <p><strong>Address:</strong> {user.address}</p>
          </div>
        )}
      </div>

      <div style={styles.detailsSection}>
        <h3 style={styles.sectionTitle}>Registered Courses</h3>
        {registeredCourses.length > 0 ? (
          <ul style={styles.courseList}>
            {registeredCourses.map((course) => (
              <li key={course._id} style={styles.courseItem}>
                <strong>{course.title}</strong> - {course.schedule}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not registered for any courses yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1.5rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: "1rem",
    marginBottom: "1rem",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "1.5rem",
  },
  basicInfo: {
    flex: 1,
  },
  name: {
    fontSize: "2rem",
    margin: "0",
  },
  username: {
    color: "#888",
    margin: "0.25rem 0",
  },
  email: {
    color: "#555",
    margin: "0.25rem 0",
  },
  detailsSection: {
    marginBottom: "1rem",
  },
  sectionTitle: {
    borderBottom: "2px solid #007bff",
    paddingBottom: "0.5rem",
    marginBottom: "0.75rem",
  },
  courseList: {
    listStyleType: "none",
    padding: 0,
  },
  courseItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
  },
};

export default Profile;
