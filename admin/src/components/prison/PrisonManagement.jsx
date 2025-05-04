import React, { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, Tab, Tabs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Prison Management
        </Typography>
      </Box>

      {view === "list" && (
        <>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Add New Prison
            </Button>
          </Box>
          <PrisonTable
            prisons={prisons}
            loading={loading}
            error={error}
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
    </div>
  );
};

export default PrisonManagement;
