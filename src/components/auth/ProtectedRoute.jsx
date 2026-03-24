import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { session, profile, loading } = useAuth();

  if (loading) return <div className="container section">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;

  if (requireAdmin) {
    const role = profile?.role || session?.user?.user_metadata?.role;
    if (role !== "admin") return <Navigate to="/" replace />;
  }

  return children;
}
