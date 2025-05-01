import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import categoryService from "../../services/categoryService";

// Attribute type mapping for display
const ATTRIBUTE_TYPE_LABELS = {
  text: "Text Input",
  textarea: "Text Area",
  number: "Number",
  select: "Dropdown Select",
  multiselect: "Multi-Select",
  color: "Color",
  dimensions: "Dimensions",
  weight: "Weight",
  material: "Material",
  language: "Language",
};

export default function CategoryAttributesView({ category, onBack }) {
  const [attributes, setAttributes] = useState(category.attributes || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState(null);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategoryAttributes(category.id);
      setAttributes(data);
      setError(null);
    } catch (err) {
      console.error(
        `Failed to fetch attributes for category ${category.id}:`,
        err
      );
      setError("Failed to load category attributes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (attribute) => {
    setAttributeToDelete(attribute);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!attributeToDelete) return;

    try {
      await categoryService.deleteAttribute(attributeToDelete.id);
      // Refresh the attributes list
      await fetchAttributes();
      setDeleteDialogOpen(false);
      setAttributeToDelete(null);
    } catch (error) {
      console.error("Error deleting attribute:", error);
      setError("Failed to delete attribute. Please try again.");
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAttributeToDelete(null);
  };

  if (loading) {
    return (
      <Paper sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {category.nameEn} Attributes
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {category.nameEn} Attributes
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            p: 2,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography variant="body1" sx={{ mr: 1 }}>
            <strong>Category:</strong> {category.nameEn}{" "}
            {category.nameSi && `(${category.nameSi})`}
          </Typography>
          <Chip label={category.code} size="small" sx={{ ml: 1 }} />
        </Box>

        <Divider sx={{ mb: 3 }} />

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
              No attributes found for this category.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {attributes.map((attribute) => (
              <Grid item xs={12} md={6} key={attribute.id}>
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
                          color="error"
                          onClick={() => handleDeleteClick(attribute)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Type:{" "}
                      {ATTRIBUTE_TYPE_LABELS[attribute.type] || attribute.type}
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

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          Back to Categories
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the attribute "
            {attributeToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
