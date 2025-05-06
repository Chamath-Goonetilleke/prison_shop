import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./page/AdminDashboard";
import LoginPage from "./page/LoginPage";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      await axios.get("http://localhost:8080/api/auth/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("adminToken");
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </React.Fragment>
  );
}

export default App;
