import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const currentUser = getCurrentUser(); // parse token from localStorage or something

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/profile" />;
  }

  return children;
};

export default ProtectedRoute;
