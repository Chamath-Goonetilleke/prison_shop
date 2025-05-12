import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableContainer,
  Typography,
  Button,
  Chip,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import customOrderService from "../../services/customOrderService";
import { format } from "date-fns";

const CustomOrdersTable = ({ onView }) => {
  const [customOrders, setCustomOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on search term
    if (searchTerm.trim() === "") {
      setFilteredOrders(customOrders);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = customOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(lowercasedSearch) ||
          order.customer_name.toLowerCase().includes(lowercasedSearch) ||
          (order.customer_email &&
            order.customer_email.toLowerCase().includes(lowercasedSearch)) ||
          (order.customer_phone &&
            order.customer_phone.toLowerCase().includes(lowercasedSearch)) ||
          (order.category_name &&
            order.category_name.toLowerCase().includes(lowercasedSearch)) ||
          (order.subcategory_name &&
            order.subcategory_name.toLowerCase().includes(lowercasedSearch)) ||
          (order.prison_name &&
            order.prison_name.toLowerCase().includes(lowercasedSearch)) ||
          (order.status &&
            order.status.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredOrders(filtered);
    }
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, customOrders]);

  const fetchCustomOrders = async () => {
    try {
      setLoading(true);
      const data = await customOrderService.getAllCustomOrders();
      setCustomOrders(data);
      setFilteredOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching custom orders:", err);
      setError("Failed to load custom orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      // Trigger search on Enter key
      // This is already handled by the useEffect
    }
  };

  const getStatusChip = (status) => {
    // Use the same status colors as OrdersTable
    const statusColors = {
      pending: "warning",
      approved: "success",
      reviewed: "info",
      in_progress: "warning",
      completed: "success",
      cancelled: "error",
    };

    return (
      <Chip
        label={status.toUpperCase()}
        color={statusColors[status] || "default"}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search bar */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          onKeyPress={handleSearchKeyPress}
          sx={{ flexGrow: 1, mr: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          placeholder="Search by order #, customer, category, status..."
        />
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Prison</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No custom orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow hover key={order.id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.category_name}</TableCell>
                      <TableCell>{order.subcategory_name || "-"}</TableCell>
                      <TableCell>{order.prison_name || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => onView(order)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default CustomOrdersTable;
