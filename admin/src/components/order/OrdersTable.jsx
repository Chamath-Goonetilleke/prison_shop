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
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import orderService from "../../services/orderService";

const columns = [
  { id: "orderNumber", label: "Order Number", minWidth: 130 },
  { id: "customer_name", label: "Customer Name", minWidth: 130 },
  { id: "customer_phone", label: "Phone", minWidth: 120 },
  { id: "total_amount", label: "Total Amount", minWidth: 100 },
  { id: "item_count", label: "Items", minWidth: 80 },
  { id: "payment_slip", label: "Payment Slip", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "created_at", label: "Order Date", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

// Status chip colors
const statusColors = {
  pending: "warning",
  approved: "success",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

export default function OrdersTable({ onView }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again later.");
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
      setFilteredOrders(orders);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(lowercasedSearch) ||
        order.customer_name.toLowerCase().includes(lowercasedSearch) ||
        order.customer_email.toLowerCase().includes(lowercasedSearch) ||
        order.customer_phone.toLowerCase().includes(lowercasedSearch)
    );

    setFilteredOrders(filtered);
    setPage(0);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleViewClick = (order) => {
    if (onView) {
      onView(order);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
    <Box>
      {/* Search bar */}
      <Box sx={{  display: "flex", alignItems: "center", mb: 4 }}>
        <TextField
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
          placeholder="Search by order number, customer name, email or phone..."
        />
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ minHeight: "60vh" }}>
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
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={order.id}
                      >
                        {columns.map((column) => {
                          if (column.id === "actions") {
                            return (
                              <TableCell key={column.id}>
                                <Box sx={{ display: "flex" }}>
                                  <Tooltip title="View Order Details">
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleViewClick(order)}
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            );
                          }

                          if (column.id === "status") {
                            return (
                              <TableCell key={column.id}>
                                <Chip
                                  label={order.status.toUpperCase()}
                                  color={
                                    statusColors[order.status] || "default"
                                  }
                                  size="small"
                                />
                              </TableCell>
                            );
                          }

                          if (column.id === "payment_slip") {
                            return (
                              <TableCell key={column.id}>
                                {order.payment_slip ? (
                                  <Tooltip title="View Payment Slip">
                                    <Button
                                      variant="text"
                                      size="small"
                                      onClick={() =>
                                        window.open(
                                          order.payment_slip,
                                          "_blank"
                                        )
                                      }
                                    >
                                      View Receipt
                                    </Button>
                                  </Tooltip>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Not uploaded
                                  </Typography>
                                )}
                              </TableCell>
                            );
                          }

                          if (column.id === "created_at") {
                            return (
                              <TableCell key={column.id}>
                                {formatDate(order.created_at)}
                              </TableCell>
                            );
                          }

                          if (column.id === "total_amount") {
                            return (
                              <TableCell key={column.id}>
                                {formatPrice(order.total_amount)}
                              </TableCell>
                            );
                          }

                          let value = order[column.id];
                          return <TableCell key={column.id}>{value}</TableCell>;
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
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

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
    </Box>
  );
}
