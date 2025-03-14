import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, removeToken } from "../services/auth";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  // If on login or register page, do not display the nav bar.
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/profile" style={styles.navLink}>
            Profile
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/courses" style={styles.navLink}>
            Courses
          </Link>
        </li>
        {user && user.role === "admin" && (
          <li style={styles.navItem}>
            <Link to="/admin" style={styles.navLink}>
              Admin Dashboard
            </Link>
          </li>
        )}
        <li style={styles.navItem}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#007bff",
    padding: "1rem",
    zIndex: 1000,
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 1rem",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  logoutButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default NavBar;
