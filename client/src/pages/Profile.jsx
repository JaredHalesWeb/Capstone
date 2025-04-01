import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const token = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user"));

  const getImageUrl = (user) => {
    const placeholder = "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk";
    if (user && user.profileImage && user.profileImage.data) {
      return `data:${user.profileImage.contentType};base64,${user.profileImage.data}`;
    }
    return placeholder;
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

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
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

  // ... (rest of your component code)

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>
      {user && (
        <div style={styles.profileCard}>
          <div 
            style={styles.imageContainer} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={getImageUrl(user)}
              alt="Profile"
              style={styles.profileImage}
            />
            <div 
              {...getRootProps()} 
              style={{ 
                ...styles.dropzoneOverlay, 
                opacity: isHovered ? 1 : 0 
              }}
            >
              <input {...getInputProps()} />
              <p style={styles.dropzoneText}>Click or drag & drop image to upload</p>
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <button onClick={handleImageUpload} style={styles.uploadButton}>
              Upload Image
            </button>
            <button onClick={handleImageDelete} style={styles.deleteButton}>
              Delete Profile Image
            </button>
          </div>
          {editing ? (
            <>
              <input
                name="firstname"
                value={user.firstname}
                onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                style={styles.input}
                placeholder="First Name"
              />
              <input
                name="lastname"
                value={user.lastname}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                style={styles.input}
                placeholder="Last Name"
              />
              <input
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                style={styles.input}
                placeholder="Email"
              />
              <input
                name="telephone"
                value={user.telephone}
                onChange={(e) => setUser({ ...user, telephone: e.target.value })}
                style={styles.input}
                placeholder="Telephone"
              />
              <input
                name="address"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                style={styles.input}
                placeholder="Address"
              />
              <button onClick={handleImageUpload} style={styles.uploadButton}>
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
              <button onClick={() => setEditing(true)} style={styles.uploadButton}>
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
  imageContainer: {
    position: "relative",
    width: "150px",
    height: "150px",
    margin: "0 auto",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
  },
  dropzoneOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 0.2s ease-in-out",
    cursor: "pointer",
    opacity: 0,
  },
  dropzoneText: {
    fontSize: "0.9rem",
    textAlign: "center",
    margin: 0,
    padding: "0 5px",
  },
  buttonContainer: {
    marginTop: "1rem",
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "0.5rem",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  input: {
    display: "block",
    width: "100%",
    margin: "0.5rem auto",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};

export default Profile;
