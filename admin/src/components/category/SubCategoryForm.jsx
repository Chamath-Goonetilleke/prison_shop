import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import subCategoryService from "../../services/subCategoryService";
import categoryService from "../../services/categoryService";

export default function SubCategoryForm({
  onBack,
  editSubCategory = null,
  mode = "add",
}) {
  const [formData, setFormData] = useState({
    nameEn: "",
    nameSi: "",
    description: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);

        // Set default category if adding new subcategory
        if (mode === "add" && data.length > 0 && !formData.category_id) {
          setFormData((prev) => ({ ...prev, category_id: data[0].id }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification("Error loading categories", "error");
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // If editing, populate form with subcategory data
  useEffect(() => {
    if (editSubCategory && mode === "edit") {
      setFormData({
        nameEn: editSubCategory.nameEn || "",
        nameSi: editSubCategory.nameSi || "",
        description: editSubCategory.description || "",
        category_id: editSubCategory.category_id || "",
      });
    }
  }, [editSubCategory, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const validateForm = () => {
    if (!formData.nameEn) {
      showNotification("Name (English) is required", "error");
      return false;
    }
    if (!formData.category_id) {
      showNotification("Category is required", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === "add") {
        await subCategoryService.createSubCategory(formData);
        showNotification("Subcategory created successfully");
      } else {
        await subCategoryService.updateSubCategory(
          editSubCategory.id,
          formData
        );
        showNotification("Subcategory updated successfully");
      }

      // Wait for notification to be seen before going back
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      showNotification(
        `Error ${mode === "add" ? "creating" : "updating"} subcategory: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">
          {mode === "add" ? "Add New Subcategory" : "Edit Subcategory"}
        </Typography>
      </Box>

      {fetchingCategories ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category_id"
              name="category_id"
              value={formData.category_id}
              label="Category"
              onChange={handleInputChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nameSi
                    ? `${category.nameEn} (${category.nameSi})`
                    : category.nameEn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Name (English)"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Name (Sinhala)"
            name="nameSi"
            value={formData.nameSi}
            onChange={handleInputChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : mode === "add" ? (
                "Create"
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
