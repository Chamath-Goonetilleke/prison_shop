import * as React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import productService from "../../services/productService";
import subCategoryService from "../../services/subCategoryService";

const columns = [
  { id: "image", label: "Image", minWidth: 100 },
  { id: "productCode", label: "Product Code", minWidth: 100 },
  { id: "nameEn", label: "Name(English)", minWidth: 100 },
  { id: "nameSi", label: "Name(Sinhala)", minWidth: 170 },
  { id: "type", label: "Category", minWidth: 100 },
  { id: "subCategory", label: "Sub Category", minWidth: 100 },
  { id: "prisonName", label: "Prison", minWidth: 100 },
  { id: "price", label: "Price", minWidth: 100 },
  { id: "stock", label: "Stock", minWidth: 80 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150 },
];

// Helper function to extract filename from path
const getFilenameFromPath = (path) => {
  if (!path) return "";
  return path.split("/").pop().split("\\").pop();
};

export default function ProductTable({ onEdit, onView }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsData = await productService.getAllProducts();

      // Fetch all subcategories
      const subcategoriesData = await subCategoryService.getAllSubCategories();

      // Create a lookup object for subcategories
      const subcategoryMap = {};
      subcategoriesData.forEach((subcategory) => {
        subcategoryMap[subcategory.id] = subcategory;
      });

      setSubcategories(subcategoryMap);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again later.");
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

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.nameEn.toLowerCase().includes(lowercasedSearch) ||
        (product.nameSi &&
          product.nameSi.toLowerCase().includes(lowercasedSearch)) ||
        product.productCode.toLowerCase().includes(lowercasedSearch) ||
        (product.description &&
          product.description.toLowerCase().includes(lowercasedSearch))
    );

    setFilteredProducts(filtered);
    setPage(0);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEdit = (product) => {
    if (onEdit) {
      onEdit(product);
    }
  };

  const handleView = (product) => {
    if (onView) {
      onView(product);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);

      setNotification({
        open: true,
        message: "Product deleted successfully",
        severity: "success",
      });

      // Refresh the product list
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({
        open: true,
        message: "Error deleting product",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Helper function to get subcategory from ID
  const getSubCategory = (product) => {
    if (product.subCategory_id && subcategories[product.subCategory_id]) {
      const subcategory = subcategories[product.subCategory_id];
      return subcategory.nameSi
        ? `${subcategory.nameEn} (${subcategory.nameSi})`
        : subcategory.nameEn;
    }

    // Fallback to attributes subcategory if exists (for backward compatibility)
    if (product.attributes && product.attributes.subCategory) {
      return product.attributes.subCategory;
    }

    return "-";
  };

  // Format price with currency
  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* Search bar */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          sx={{ flexGrow: 1, mr: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          placeholder="Search by name, code or description..."
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: "75vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={product.id}
                    >
                      {columns.map((column) => {
                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id}>
                              <Box sx={{ display: "flex" }}>
                                <Tooltip title="View Product">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleView(product)}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Product">
                                  <IconButton
                                    color="info"
                                    onClick={() => handleEdit(product)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Product">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteClick(product)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          );
                        }

                        let value = product[column.id];

                        // Handle special cases
                        if (column.id === "subCategory") {
                          value = getSubCategory(product);
                        } else if (column.id === "price") {
                          value = formatPrice(value);
                        } else if (column.id === "type") {
                          // Display the category name instead of type code
                          value = product.categoryName || product.type;
                        }

                        return (
                          <TableCell key={column.id}>
                            {column.id === "image" ? (
                              <img
                                src={
                                  product.mainImage
                                    ? product.mainImage
                                    : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
                                }
                                alt={product.nameEn}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  border: "1px solid #ddd",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                                }}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "
            {productToDelete?.nameEn}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
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
    </Paper>
  );
}
