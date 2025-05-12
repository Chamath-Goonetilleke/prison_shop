import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PrisonTable from "./PrisonTable";
import PrisonForm from "./PrisonForm";
import prisonService from "../../services/prisonService";

const PrisonManagement = () => {
  const [view, setView] = useState("list"); // list, add, edit
  const [prisons, setPrisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrison, setSelectedPrison] = useState(null);

  useEffect(() => {
    fetchPrisons();
  }, []);

  const fetchPrisons = async () => {
    try {
      setLoading(true);
      const data = await prisonService.getAllPrisons();
      setPrisons(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch prisons:", err);
      setError("Failed to load prisons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedPrison(null);
    setView("add");
  };

  const handleEditClick = (prison) => {
    setSelectedPrison(prison);
    setView("edit");
  };

  const handleViewClick = (prison) => {
    setSelectedPrison(prison);
    setView("view");
  };

  const handleBackToList = () => {
    setView("list");
    fetchPrisons(); // Refresh the list after adding/editing
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#27548A",
          borderRadius: "0 0 0.5rem 0.5rem",
          padding: "0.5rem",
          py: "1rem",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={"bold"}
          sx={{
            color: "white",

            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <LocationCityIcon sx={{ fontSize: "1.8rem" }} />
          Prison Management
        </Typography>
        {view === "list" && !loading && !error && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            size="medium"
          >
            Add New Prison
          </Button>
        )}
      </Box>

      <Box sx={{ width: "100%", p: 2 }}>
        {loading && view === "list" && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {view === "list" && !loading && (
          <>
            <PrisonTable
              prisons={prisons}
              loading={false}
              error={null}
              onEdit={handleEditClick}
              onView={handleViewClick}
              onRefresh={fetchPrisons}
            />
          </>
        )}

        {(view === "add" || view === "edit") && (
          <PrisonForm
            prison={selectedPrison}
            mode={view}
            onBack={handleBackToList}
          />
        )}
      </Box>
    </>
  );
};

export default PrisonManagement;
