import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { format } from "date-fns";
import customOrderService from "../../services/customOrderService";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const CustomOrderDetails = ({ order, onClose, onOrderUpdated }) => {
  const [status, setStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      setSuccess(false);

      const updatedOrder = await customOrderService.updateCustomOrderStatus(
        order.id,
        {
          status,
          admin_notes: adminNotes,
        }
      );

      setSuccess(true);
      onOrderUpdated(updatedOrder);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#9e9e9e";
      case "reviewed":
        return "#2196f3";
      case "approved":
        return "#3f51b5";
      case "in_progress":
        return "#ff9800";
      case "completed":
        return "#4caf50";
      case "cancelled":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onClose} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Custom Order Details</Typography>
        <Chip
          label={status.replace("_", " ")}
          sx={{
            ml: 2,
            textTransform: "capitalize",
            bgcolor: getStatusColor(status),
            color: "white",
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Order status updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Number
                </Typography>
                <Typography variant="body1">{order.orderNumber}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Date Placed
                </Typography>
                <Typography variant="body1">
                  {format(new Date(order.created_at), "PPP p")}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">{order.category_name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Subcategory
                </Typography>
                <Typography variant="body1">
                  {order.subcategory_name || "None"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Prison
                </Typography>
                <Typography variant="body1">
                  {order.prison_name
                    ? order.prison_name_si
                      ? `${order.prison_name} (${order.prison_name_si})`
                      : order.prison_name
                    : "None"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{order.customer_name}</Typography>
              </Box>
              <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <EmailIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography variant="body1">{order.customer_email}</Typography>
              </Box>
              <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <PhoneIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography variant="body1">{order.customer_phone}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <LocationOnIcon
                  fontSize="small"
                  sx={{ mr: 1, mt: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body1">
                  {order.delivery_address}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Requirements
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {order.requirements}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Order Management
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateStatus}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Status"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CustomOrderDetails;
