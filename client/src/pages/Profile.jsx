import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const token = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user"));
  
  // A helper function that returns the full URL of the image
  const getImageUrl = (imagePath) => {
    const placeholder = "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk";
    if (!imagePath) return placeholder;
    if (imagePath.startsWith("http")) return imagePath;
    console.log(`${window.location.origin}${imagePath}`)
    return `${window.location.origin}${imagePath}`;
  };

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
    fetchProfile();
  }, [token, localUser.id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Accepted files:", acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Generate a blob URL for preview
      file.preview = URL.createObjectURL(file);
      setProfileImageFile(file);
    }
  }, []);
   
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });
  

  const handleImageUpload = async () => {
    if (!profileImageFile) return;
    const formData = new FormData();
    formData.append("image", profileImageFile);
    try {
      const res = await axios.post(`/api/upload/profile-image/${user._id}`, formData, {
        headers: { Authorization: token },
      });
      setUser(res.data);
      setProfileImageFile(null);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleImageDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile image?")) return;
    try {
      const res = await axios.delete(`/api/upload/profile-image/${user._id}`, {
        headers: { Authorization: token },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Image deletion failed", err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/users/${user._id}`, user, {
        headers: { Authorization: token },
      });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>
      {user && (
        <div style={styles.profileCard}>
          <img
            src={getImageUrl(user.profileImageUrl)}
            alt="Profile"
            style={styles.profileImage}
          />
          <div style={styles.imageUploadContainer}>
            <div {...getRootProps()} style={styles.dropzone}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag & drop an image here, or click to select file</p>
              )}
            </div>
            {profileImageFile && (
              <p>Selected file: {profileImageFile.name}</p>
            )}
            <div>
              <button onClick={handleImageUpload} style={styles.button}>
                Upload Image
              </button>
              <button onClick={handleImageDelete} style={styles.deleteButton}>
                Delete Profile Image
              </button>
            </div>
          </div>
          {editing ? (
            <>
              <input
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
                style={styles.input}
                placeholder="First Name"
              />
              <input
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
                style={styles.input}
                placeholder="Last Name"
              />
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Email"
              />
              <input
                name="telephone"
                value={user.telephone}
                onChange={handleChange}
                style={styles.input}
                placeholder="Telephone"
              />
              <input
                name="address"
                value={user.address}
                onChange={handleChange}
                style={styles.input}
                placeholder="Address"
              />
              <button onClick={handleSave} style={styles.button}>
                Save Changes
              </button>
              <button onClick={() => setEditing(false)} style={styles.cancelButton}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {user.firstname} {user.lastname}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.telephone}
              </p>
              <p>
                <strong>Address:</strong> {user.address}
              </p>
              <button onClick={() => setEditing(true)} style={styles.button}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "6rem auto", padding: "1rem" },
  profileCard: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginBottom: "1rem",
    objectFit: "cover",
  },
  imageUploadContainer: {
    marginBottom: "1rem",
  },
  dropzone: {
    border: "2px dashed #007bff",
    borderRadius: "8px",
    padding: "1rem",
    cursor: "pointer",
    marginBottom: "0.5rem",
  },
  input: {
    display: "block",
    width: "100%",
    margin: "0.5rem auto",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "0.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    marginLeft: "1rem",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "0.5rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Profile;
