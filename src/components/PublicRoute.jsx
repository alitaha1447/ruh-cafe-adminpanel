import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    children
  );
};

export default PublicRoute;
