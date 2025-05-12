import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import prisonService from "../../services/prisonService";

// Helper function to ensure valid severity values
const getSafeSeverity = (severity) => {
  const validSeverities = ["error", "warning", "info", "success"];
  return validSeverities.includes(String(severity)) ? severity : "info";
};

const PrisonForm = ({ prison, mode = "add", onBack }) => {
  const [formData, setFormData] = useState({
    prison_no: "",
    nameEn: "",
    nameSi: "",
    location: "",
    contact: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Populate form with existing data if editing
  useEffect(() => {
    if (prison && mode === "edit") {
      setFormData({
        prison_no: prison.prison_no || "",
        nameEn: prison.nameEn || "",
        nameSi: prison.nameSi || "",
        location: prison.location || "",
        contact: prison.contact || "",
        status: prison.status || "Active",
      });
    }
  }, [prison, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.prison_no.trim()) {
      newErrors.prison_no = "Prison number is required";
    }
    if (!formData.nameEn.trim()) {
      newErrors.nameEn = "Name in English is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // If editing existing prison
      if (mode === "edit" && prison) {
        await prisonService.updatePrison(prison.id, formData);
        setNotification({
          open: true,
          message: "Prison updated successfully",
          severity: "success",
        });
      }
      // If creating new prison
      else {
        await prisonService.createPrison(formData);
        setNotification({
          open: true,
          message: "Prison created successfully",
          severity: "success",
        });

        // Clear form if adding
        if (mode === "add") {
          setFormData({
            prison_no: "",
            nameEn: "",
            nameSi: "",
            location: "",
            contact: "",
            status: "Active",
          });
        }
      }

      // Wait a moment to show success message before going back
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 1500);
    } catch (error) {
      console.error("Error saving prison:", error);
      setNotification({
        open: true,
        message: `Error: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">
          {mode === "edit" ? "Edit Prison" : "Add New Prison"}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            required
            label="Prison No"
            name="prison_no"
            value={formData.prison_no}
            onChange={handleInputChange}
            error={!!errors.prison_no}
            helperText={errors.prison_no}
          />
          <TextField
            fullWidth
            required
            label="Name (English)"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleInputChange}
            error={!!errors.nameEn}
            helperText={errors.nameEn}
          />
          <TextField
            fullWidth
            label="Name (Sinhala)"
            name="nameSi"
            value={formData.nameSi}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            multiline
            rows={2}
            value={formData.location}
            onChange={handleInputChange}
          />
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleInputChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
            size="large"
            sx={{mt:2}}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button variant="outlined" size="large" onClick={onBack}>
            Cancel
          </Button>
        </Box>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={getSafeSeverity(notification.severity)}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PrisonForm;
