import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    telephone: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post("/api/auth/register", formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div style={styles.outerWrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {Object.entries(formData).map(([field, value]) => (
            <div key={field} style={styles.inputGroup}>
              <label htmlFor={field} style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                value={value}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          ))}
          <button type="submit" style={styles.button}>Register</button>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <p style={styles.linkText}>
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  outerWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
    padding: "1rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "0.25rem",
    fontSize: "0.95rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "1rem",
    padding: "0.6rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "0.5rem",
  },
  success: {
    color: "green",
    marginTop: "0.5rem",
  },
  linkText: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
  },
};

export default Register;
