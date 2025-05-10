import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Grid,
  Chip,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomOrderDetailsModal = ({ open, onClose, order }) => {
  if (!order) return null;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status chip with appropriate color
  const getStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip size="small" label="Pending" color="default" />;
      case "reviewed":
        return <Chip size="small" label="Reviewed" color="info" />;
      case "approved":
        return <Chip size="small" label="Approved" color="primary" />;
      case "in_progress":
        return <Chip size="small" label="In Progress" color="warning" />;
      case "completed":
        return <Chip size="small" label="Completed" color="success" />;
      case "cancelled":
        return <Chip size="small" label="Cancelled" color="error" />;
      default:
        return <Chip size="small" label={status} color="default" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="custom-order-details-dialog-title"
    >
      <DialogTitle id="custom-order-details-dialog-title">
        Custom Order Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Number
              </Typography>
              <Typography variant="body1" gutterBottom>
                {order.orderNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Date Placed
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(order.created_at)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Typography variant="body1" gutterBottom>
                {order.category_name}
              </Typography>
            </Grid>
            {order.subcategory_name && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Subcategory
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {order.subcategory_name}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>{getStatusChip(order.status)}</Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">{order.customer_name}</Typography>
          <Typography variant="body1">{order.customer_email}</Typography>
          <Typography variant="body1">{order.customer_phone}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {order.delivery_address}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Requirements
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {order.requirements}
          </Typography>
        </Paper>

        {order.admin_notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Admin Notes
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body1">{order.admin_notes}</Typography>
            </Paper>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomOrderDetailsModal;
