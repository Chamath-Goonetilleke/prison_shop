import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";
import customOrderService from "../../services/customOrderService";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import LayersIcon from "@mui/icons-material/Layers";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors = {
  pending: "warning",
  reviewed: "info",
  approved: "success",
  in_progress: "warning",
  completed: "success",
  cancelled: "error",
};

const CustomOrderDetails = ({ order, onClose, onOrderUpdated }) => {
  const [status, setStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleNotesChange = (event) => {
    setAdminNotes(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const updatedOrder = await customOrderService.updateCustomOrderStatus(
        order.id,
        {
          status,
          admin_notes: adminNotes,
        }
      );

      setConfirmDialogOpen(false);
      setNotification({
        open: true,
        message: "Custom order status updated successfully!",
        severity: "success",
      });
      onOrderUpdated(updatedOrder);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status. Please try again.");
      setNotification({
        open: true,
        message: "Failed to update order status. Please try again.",
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
          Custom Order Details - {order.orderNumber}
        </Typography>
        <Chip
          label={status.toUpperCase()}
          color={statusColors[status] || "default"}
          size="small"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper elevation={2} sx={{ flex: 1 }}>
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
          <Box sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2 }}>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PersonIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <strong>Name:</strong> {order.customer_name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <EmailIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <strong>Email:</strong> {order.customer_email}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
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
        </Paper>

        <Paper elevation={2} sx={{ flex: 1 }}>
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
          <Box sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2 }}>
            <Typography variant="body1">
              <CalendarMonthIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <strong>Order Date:</strong> {formatDate(order.created_at)}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LayersIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <strong>Category:</strong> {order.category_name}
            </Typography>
            {order.subcategory_name && (
              <Typography variant="body1" sx={{ ml: 3 }}>
                <SubdirectoryArrowRightIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <strong>Subcategory:</strong> {order.subcategory_name}
              </Typography>
            )}
            {order.prison_name && (
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <StoreIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <strong>Prison:</strong>{" "}
                {order.prison_name_si
                  ? `${order.prison_name} (${order.prison_name_si})`
                  : order.prison_name}
              </Typography>
            )}
          </Box>
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
          Custom Requirements
        </Typography>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {order.requirements}
          </Typography>
        </Box>
      </Paper>

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
          Order Management
        </Typography>
        <Box sx={{ p: 2, display: "flex", gap: 2, flexDirection: "column" }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={status}
              label="Status"
              onChange={handleStatusChange}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            id="admin-notes"
            label="Admin Notes"
            multiline
            rows={4}
            value={adminNotes}
            onChange={handleNotesChange}
            placeholder="Add notes about this custom order"
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: "1rem" }}
            onClick={() => setConfirmDialogOpen(true)}
            disabled={
              loading ||
              (status === order.status && adminNotes === order.admin_notes)
            }
          >
            {loading ? <CircularProgress size={24} /> : "Update Status"}
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Update Custom Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update the custom order status to{" "}
            {status.toUpperCase()}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
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

export default CustomOrderDetails;
