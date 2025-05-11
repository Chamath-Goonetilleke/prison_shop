import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import orderService from "../../services/orderService";

// Order status options for the dropdown
const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

// Status chip colors
const statusColors = {
  pending: "warning",
  approved: "success",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

// Status icons
const statusIcons = {
  pending: null,
  approved: <CheckCircleIcon />,
  shipped: <LocalShippingIcon />,
  delivered: <DeliveryDiningIcon />,
  cancelled: <CancelIcon />,
};

const OrderDetails = ({ order, onClose, onOrderUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order?.status || "pending");
  const [adminNotes, setAdminNotes] = useState(order?.admin_notes || "");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  if (!order) {
    return null;
  }

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price with currency
  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleNotesChange = (event) => {
    setAdminNotes(event.target.value);
  };

  const handleUpdateOrder = async () => {
    setLoading(true);
    try {
      await orderService.updateOrderStatus(order.id, status, adminNotes);
      setNotification({
        open: true,
        message: "Order status updated successfully",
        severity: "success",
      });

      // Close dialog
      setConfirmDialogOpen(false);

      // Notify parent component that order was updated
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          status,
          admin_notes: adminNotes,
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setNotification({
        open: true,
        message: `Failed to update order status: ${error.message}`,
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
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" component="h2">
          Order Details - {order.orderNumber}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            icon={statusIcons[order.status]}
            label={order.status.toUpperCase()}
            color={statusColors[order.status] || "default"}
          />
          <Button variant="outlined" onClick={onClose}>
            Back to List
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Name:</strong> {order.customer_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Email:</strong> {order.customer_email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Phone:</strong> {order.customer_phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Delivery Address:</strong>
                </Typography>
                <Typography variant="body2">
                  {order.delivery_address}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Order Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Order Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Order Date:</strong> {formatDate(order.created_at)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Total Amount:</strong>{" "}
                  {formatPrice(order.total_amount)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Status:</strong>
                </Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={status}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    {ORDER_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin Notes"
                  multiline
                  rows={2}
                  value={adminNotes}
                  onChange={handleNotesChange}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={
                    loading ||
                    (status === order.status &&
                      adminNotes === order.admin_notes)
                  }
                >
                  {loading ? <CircularProgress size={24} /> : "Update Order"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Order Items
            </Typography>
            {order.items && order.items.length > 0 ? (
              <TableContainer>
                <Table aria-label="order items table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Prison</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.product_name
                            ? item.product_name
                            : `Product #${item.product_id}`}
                        </TableCell>
                        <TableCell>
                          {item.prison_name
                            ? item.prison_name_si
                              ? `${item.prison_name} (${item.prison_name_si})`
                              : item.prison_name
                            : "Not specified"}
                        </TableCell>
                        <TableCell>{formatPrice(item.price)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatPrice(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} />
                      <TableCell>
                        <Typography variant="subtitle1">Total</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {formatPrice(order.total_amount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No items in this order
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Payment Slip */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Payment Slip
            </Typography>
            {order.payment_slip ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={order.payment_slip}
                    alt="Payment Slip"
                    sx={{ objectFit: "contain" }}
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          window.open(order.payment_slip, "_blank")
                        }
                      >
                        View Full Size
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No payment slip uploaded
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update the order status to{" "}
            {status.toUpperCase()}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateOrder}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update"}
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
    </Box>
  );
};

export default OrderDetails;
