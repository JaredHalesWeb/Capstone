import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const currentUser = getCurrentUser();
  
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If the route is admin-only and the user is not an admin, redirect to profile
  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/profile" />;
  }
  
  return children;
};

export default ProtectedRoute;
