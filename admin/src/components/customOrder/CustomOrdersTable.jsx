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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import customOrderService from "../../services/customOrderService";
import { format } from "date-fns";

const CustomOrdersTable = ({ onView }) => {
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  const fetchCustomOrders = async () => {
    try {
      setLoading(true);
      const data = await customOrderService.getAllCustomOrders();
      setCustomOrders(data);
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

  const getStatusChip = (status) => {
    let color;
    switch (status) {
      case "pending":
        color = "default";
        break;
      case "reviewed":
        color = "info";
        break;
      case "approved":
        color = "primary";
        break;
      case "in_progress":
        color = "warning";
        break;
      case "completed":
        color = "success";
        break;
      case "cancelled":
        color = "error";
        break;
      default:
        color = "default";
    }

    return <Chip label={status.replace("_", " ")} color={color} />;
  };

  if (loading) {
    return <Typography>Loading custom orders...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
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
              {customOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No custom orders found
                  </TableCell>
                </TableRow>
              ) : (
                customOrders
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
          count={customOrders.length}
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
