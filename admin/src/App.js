import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./page/AdminDashboard";
import LoginPage from "./page/LoginPage";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import authService from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await authService.checkAuth();
      setIsAuthenticated(true);
    } catch (error) {
      authService.logout();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 4,
          height: "90vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
