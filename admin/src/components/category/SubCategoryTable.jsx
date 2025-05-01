import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import subCategoryService from "../../services/subCategoryService";
import categoryService from "../../services/categoryService";

export default function SubCategoryTable({ onEdit }) {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchSubcategories = async (categoryId) => {
    try {
      setLoading(true);
      const data =
        await subCategoryService.getSubCategoriesByCategory(categoryId);
      setSubcategories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      setError("Failed to load subcategories");
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDeleteClick = (subcategory) => {
    setSubcategoryToDelete(subcategory);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subcategoryToDelete) return;

    try {
      setLoading(true);
      await subCategoryService.deleteSubCategory(subcategoryToDelete.id);
      setSubcategories(
        subcategories.filter((sc) => sc.id !== subcategoryToDelete.id)
      );
      setDeleteDialogOpen(false);
      setSubcategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      setError("Failed to delete subcategory");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSubcategoryToDelete(null);
  };

  const columns = [
    { id: "nameEn", label: "Name (English)", minWidth: 170 },
    { id: "nameSi", label: "Name (Sinhala)", minWidth: 170 },
    { id: "description", label: "Description", minWidth: 200 },
    { id: "actions", label: "Actions", minWidth: 100, align: "center" },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Subcategories
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-select-label">Select Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Select Category"
            onChange={handleCategoryChange}
            disabled={loading}
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
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {loading
                    ? "Loading..."
                    : "No subcategories found for this category"}
                </TableCell>
              </TableRow>
            ) : (
              subcategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((subcategory) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={subcategory.id}
                  >
                    <TableCell>{subcategory.nameEn}</TableCell>
                    <TableCell>{subcategory.nameSi || "-"}</TableCell>
                    <TableCell>{subcategory.description || "-"}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit && onEdit(subcategory)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(subcategory)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={subcategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the subcategory
            <strong>
              {subcategoryToDelete ? ` "${subcategoryToDelete.nameEn}"` : ""}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
