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
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import orderService from "../../services/orderService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
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
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
          <ArrowBackIcon sx={{ fontWeight: "bold" }} />
        </IconButton>
        <Typography
          variant="h5"
          component="h2"
          fontWeight={"bold"}
          sx={{ mr: 2 }}
        >
          Order Details - {order.orderNumber}
        </Typography>
        <Chip
          icon={statusIcons[order.status]}
          label={order.status.toUpperCase()}
          color={statusColors[order.status] || "default"}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper elevation={2} sx={{ flex: 1 }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: "bold",
                p: 1,
                color: "#24364d",
                backgroundColor: "#e5f6fd",
              }}
            >
              Customer Information
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2 }}
            >
              <Typography variant="body1"sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <strong>Name:</strong> {order.customer_name}
              </Typography>
              <Typography variant="body1"sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <strong>Email:</strong> {order.customer_email}
              </Typography>
              <Typography variant="body1"sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <strong>Phone:</strong> {order.customer_phone}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "flex-start" }}
              >
                <LocationOnIcon
                  fontSize="small"
                  sx={{ mr: 1, mt: 0.5, color: "text.secondary" }}
                />
                <Box>
                  <strong>Delivery Address</strong>
                  <Typography variant="body2">
                    {order.delivery_address}
                  </Typography>
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  p: 1,
                  color: "#24364d",
                  backgroundColor: "#e5f6fd",
                }}
              >
                Order Information
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", p: 2, gap: 1 }}
              >
                <Typography variant="body1">
                  <strong>Order Date:</strong> {formatDate(order.created_at)}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Amount:</strong>{" "}
                  {formatPrice(order.total_amount)}
                </Typography>
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
                <TextField
                  fullWidth
                  label="Admin Notes"
                  multiline
                  rows={2}
                  value={adminNotes}
                  onChange={handleNotesChange}
                  variant="outlined"
                />
                <Button
                  sx={{ mt: "1rem" }}
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
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper elevation={2} sx={{ flex: 0.7 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              p: 1,
              color: "#24364d",
              backgroundColor: "#e5f6fd",
            }}
          >
            Payment Slip
          </Typography>
          {order.payment_slip ? (
            <Box sx={{ display: "flex", p: 2, justifyContent: "center" }}>
              <Card sx={{ minWidth: "100%", minHeight: "100%" }}>
                <CardMedia
                  component="img"
                  height="85%"
                  image={order.payment_slip}
                  alt="Payment Slip"
                  sx={{ objectFit: "fill" }}
                />
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(order.payment_slip, "_blank")}
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
      </Box>

      <Paper elevation={2} sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: "bold",
            p: 1,
            color: "#24364d",
            backgroundColor: "#e5f6fd",
          }}
        >
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
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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

      <Grid container spacing={3}>
        {/* Customer Information */}

        {/* Order Information */}
        <Grid item xs={12} md={6}></Grid>

        {/* Order Items */}
        <Grid item xs={12}></Grid>

        {/* Payment Slip */}
        <Grid item xs={12}></Grid>
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
