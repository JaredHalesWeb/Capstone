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
        // Filter only the courses the user is registered in
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
      <h2 style={styles.title}>Student Profile</h2>
      {user && (
        <div style={styles.infoBox}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.telephone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
      <h3 style={styles.subtitle}>Registered Courses</h3>
      <ul style={styles.list}>
        {registeredCourses.map((course) => (
          <li key={course._id} style={styles.listItem}>
            {course.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
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
  infoBox: {
    marginBottom: "1rem",
    lineHeight: "1.6",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
  },
};

export default Profile;
