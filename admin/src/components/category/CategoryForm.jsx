import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  IconButton,
  Card,
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import categoryService from "../../services/categoryService";
import subCategoryService from "../../services/subCategoryService";

// Attribute types for category attributes
const ATTRIBUTE_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown Select" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "color", label: "Color" },
];

export default function CategoryForm({ onBack, editCategory = null }) {
  const isEditMode = !!editCategory;

  const [category, setCategory] = useState({
    code: "",
    nameEn: "",
    nameSi: "",
    description: "",
    image: null,
    existingImage: null,
  });

  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState({
    name: "",
    type: "text",
    options: [],
  });
  const [editingAttributeIndex, setEditingAttributeIndex] = useState(-1);
  const [attributes, setAttributes] = useState(editCategory?.attributes || []);
  const [optionInput, setOptionInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(editCategory?.image || null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({
    nameEn: "",
    nameSi: "",
    description: "",
  });

  const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Add state for confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);

  // Load category data if editing
  useEffect(() => {
    if (editCategory) {
      setCategory({
        code: editCategory.code || "",
        nameEn: editCategory.nameEn || "",
        nameSi: editCategory.nameSi || "",
        description: editCategory.description || "",
        image: null,
        existingImage: editCategory.image || null,
      });

      if (editCategory.image) {
        setImagePreview(editCategory.image);
      }

      // Fetch subcategories for this category
      if (editCategory.id) {
        fetchSubcategories(editCategory.id);
      }
    }
  }, [editCategory]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const data =
        await subCategoryService.getSubCategoriesByCategory(categoryId);
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      showNotification("Error loading subcategories", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubcategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubcategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setCategory((prev) => ({
        ...prev,
        image: selectedFile,
      }));

      // Create a preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleOpenAttributeDialog = (attribute = null, index = -1) => {
    if (attribute) {
      setCurrentAttribute(attribute);
      setEditingAttributeIndex(index);
    } else {
      setCurrentAttribute({
        name: "",
        type: "text",
        options: [],
      });
      setEditingAttributeIndex(-1);
    }
    setAttributeDialogOpen(true);
  };

  const handleCloseAttributeDialog = () => {
    setAttributeDialogOpen(false);
    setOptionInput("");
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setCurrentAttribute({
      ...currentAttribute,
      [name]: value,
    });
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setCurrentAttribute({
        ...currentAttribute,
        options: [...currentAttribute.options, optionInput.trim()],
      });
      setOptionInput("");
    }
  };

  const handleDeleteOption = (index) => {
    setCurrentAttribute({
      ...currentAttribute,
      options: currentAttribute.options.filter((_, i) => i !== index),
    });
  };

  const handleSaveAttribute = () => {
    if (!currentAttribute.name) {
      showNotification("Attribute name is required", "error");
      return;
    }

    if (editingAttributeIndex >= 0) {
      // Update existing attribute
      const updatedAttributes = [...attributes];
      updatedAttributes[editingAttributeIndex] = currentAttribute;
      setAttributes(updatedAttributes);
    } else {
      // Add new attribute
      setAttributes([...attributes, currentAttribute]);
    }

    handleCloseAttributeDialog();
  };

  const handleDeleteAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
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
    if (!category.code.trim()) {
      showNotification("Category code is required", "error");
      return false;
    }
    if (!category.nameEn.trim()) {
      showNotification("Category name in English is required", "error");
      return false;
    }
    return true;
  };

  const validateSubcategoryForm = () => {
    if (!newSubcategory.nameEn) {
      showNotification("Subcategory name is required", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", category.code);
      formData.append("nameEn", category.nameEn);
      formData.append("nameSi", category.nameSi || "");
      formData.append("description", category.description || "");

      if (category.existingImage) {
        formData.append("existingImage", category.existingImage);
      }

      if (category.image) {
        formData.append("image", category.image);
      }

      let result;
      if (isEditMode) {
        // Update existing category
        result = await categoryService.updateCategory(
          editCategory.id,
          formData
        );
        showNotification("Category updated successfully");
      } else {
        // Create new category
        result = await categoryService.createCategory(formData);
        showNotification("Category created successfully");
      }

      // If we have attributes to add, add them one by one to the category
      if (attributes.length > 0) {
        for (const attribute of attributes) {
          if (attribute.id) {
            // Update existing attribute
            await categoryService.updateAttribute(attribute.id, attribute);
          } else {
            // Add new attribute
            await categoryService.addAttribute(result.id, attribute);
          }
        }
      }

      // Wait for notification to be seen before going back
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      console.error("Error saving category:", error);
      showNotification(
        error.response?.data?.message || "Error saving category",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!validateSubcategoryForm()) return;

    setLoading(true);
    try {
      const subcategoryData = {
        ...newSubcategory,
        category_id: editCategory.id,
      };

      await subCategoryService.createSubCategory(subcategoryData);
      showNotification("Subcategory added successfully");

      // Refresh subcategories list
      fetchSubcategories(editCategory.id);

      // Clear form
      setNewSubcategory({
        nameEn: "",
        nameSi: "",
        description: "",
      });

      // Close form
      setShowAddSubcategoryForm(false);
    } catch (error) {
      console.error("Error adding subcategory:", error);
      showNotification(`Error adding subcategory: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    setSubcategoryToDelete(subcategoryId);
    setDeleteConfirmOpen(true);
  };

  // Add function to handle confirmed deletion
  const confirmDeleteSubcategory = async () => {
    setDeleteConfirmOpen(false);
    if (!subcategoryToDelete) return;

    setLoading(true);
    try {
      await subCategoryService.deleteSubCategory(subcategoryToDelete);
      showNotification("Subcategory deleted successfully");
      // Refresh subcategories list
      fetchSubcategories(editCategory.id);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      showNotification(`Error deleting subcategory: ${error.message}`, "error");
    } finally {
      setLoading(false);
      setSubcategoryToDelete(null);
    }
  };

  const needsOptions = (type) => {
    return ["select", "multiselect"].includes(type);
  };

  return (
    <Paper sx={{ padding: 3 }}>
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
        <Typography variant="h5" fontWeight="bold">
          {isEditMode ? "Edit Category" : "Add New Category"}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: "0.5rem",
          }}
        >
          Category Information
        </Typography>
        <div>
          <TextField
            required
            fullWidth
            label="Category Code"
            name="code"
            value={category.code}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            helperText="Unique code to identify this category (e.g., WORKSHOP, BAKERY)"
          />
          <TextField
            required
            fullWidth
            label="Name (English)"
            name="nameEn"
            value={category.nameEn}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name (Sinhala)"
            name="nameSi"
            value={category.nameSi}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={category.description}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
          />
        </div>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Category Image
          </Typography>

          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="category-image-upload"
            ref={fileInputRef}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <label htmlFor="category-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddPhotoAlternateIcon />}
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
            </label>
          </Box>

          {imagePreview && (
            <Card sx={{ maxWidth: 300, mt: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={imagePreview}
                alt="Category"
                sx={{ objectFit: "contain" }}
              />
            </Card>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              backgroundColor: "lightgray",
              padding: "0.5rem",
              flexGrow: 1,
            }}
          >
            Category Attributes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenAttributeDialog()}
            sx={{ ml: 2 }}
          >
            Add Attribute
          </Button>
        </Box>

        {attributes.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              border: "1px dashed #ccc",
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" color="textSecondary">
              No attributes added yet. Click "Add Attribute" to create
              attributes for this category.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {attributes.map((attribute, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {attribute.name}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleOpenAttributeDialog(attribute, index)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteAttribute(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Type:{" "}
                      {
                        ATTRIBUTE_TYPES.find(
                          (type) => type.value === attribute.type
                        )?.label
                      }
                    </Typography>
                    {attribute.options && attribute.options.length > 0 && (
                      <>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 1 }}
                        >
                          Options:
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 1 }}
                          flexWrap="wrap"
                          gap={1}
                        >
                          {attribute.options.map((option, i) => (
                            <Chip key={i} label={option} size="small" />
                          ))}
                        </Stack>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Subcategories Section - Only visible when editing an existing category */}
      {isEditMode && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Subcategories</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowAddSubcategoryForm(true)}
            >
              Add Subcategory
            </Button>
          </Box>

          {/* Add Subcategory Form */}
          {showAddSubcategoryForm && (
            <Card sx={{ mb: 3, p: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Add New Subcategory
                </Typography>

                <TextField
                  fullWidth
                  label="Name (English)"
                  name="nameEn"
                  value={newSubcategory.nameEn}
                  onChange={handleSubcategoryInputChange}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Name (Sinhala)"
                  name="nameSi"
                  value={newSubcategory.nameSi}
                  onChange={handleSubcategoryInputChange}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={newSubcategory.description}
                  onChange={handleSubcategoryInputChange}
                  margin="normal"
                  multiline
                  rows={2}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setShowAddSubcategoryForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSubcategory}
                    disabled={loading}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Subcategories List */}
          {subcategories.length > 0 ? (
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {subcategories.map((subcategory) => (
                <ListItem key={subcategory.id}>
                  <ListItemText
                    primary={subcategory.nameEn}
                    secondary={
                      <>
                        {subcategory.nameSi && (
                          <span>
                            {subcategory.nameSi}
                            <br />
                          </span>
                        )}
                        {subcategory.description && (
                          <span>{subcategory.description}</span>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteSubcategory(subcategory.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              No subcategories added yet for this category
            </Alert>
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          size="large"
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Category"
              : "Create Category"}
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={onBack}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>

      {/* Attribute Dialog */}
      <Dialog
        open={attributeDialogOpen}
        onClose={handleCloseAttributeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAttributeIndex >= 0 ? "Edit Attribute" : "Add Attribute"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Define an attribute that will be used for products in this category.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Attribute Name"
            name="name"
            value={currentAttribute.name}
            onChange={handleAttributeChange}
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="attribute-type-label">Attribute Type</InputLabel>
            <Select
              labelId="attribute-type-label"
              name="type"
              value={currentAttribute.type}
              onChange={handleAttributeChange}
              label="Attribute Type"
            >
              {ATTRIBUTE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {needsOptions(currentAttribute.type) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Options
              </Typography>
              <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                  margin="dense"
                  label="Add Option"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddOption}
                  sx={{ height: 56, minWidth: 100 }}
                >
                  Add
                </Button>
              </Box>

              {currentAttribute.options.length > 0 ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 1 }}
                  flexWrap="wrap"
                  gap={1}
                >
                  {currentAttribute.options.map((option, i) => (
                    <Chip
                      key={i}
                      label={option}
                      onDelete={() => handleDeleteOption(i)}
                    />
                  ))}
                </Stack>
              ) : (
                <Alert severity="info" sx={{ mt: 1 }}>
                  No options added yet. Add at least one option for select
                  fields.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAttributeDialog}>Cancel</Button>
          <Button onClick={handleSaveAttribute} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this subcategory?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteSubcategory}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
