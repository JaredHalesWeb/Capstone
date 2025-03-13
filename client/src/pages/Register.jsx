import React, { useState } from "react";
import { register } from "../services/auth";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert("Registration successful, please login now.");
      window.location.href = "/login";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label>{field}:</label>
            <input name={field} value={formData[field]} onChange={handleChange} />
          </div>
        ))}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
