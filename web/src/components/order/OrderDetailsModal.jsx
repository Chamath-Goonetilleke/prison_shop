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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const OrderDetailsModal = ({ open, onClose, order }) => {
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
      case "approved":
        return <Chip size="small" label="Approved" color="primary" />;
      case "shipped":
        return <Chip size="small" label="Shipped" color="info" />;
      case "delivered":
        return <Chip size="small" label="Delivered" color="success" />;
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
      aria-labelledby="order-details-dialog-title"
    >
      <DialogTitle id="order-details-dialog-title">
        Order Details
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
                Total Amount
              </Typography>
              <Typography variant="body1" gutterBottom>
                Rs. {order.total_amount}
              </Typography>
            </Grid>
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
          Shipping Information
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
          Order Items
        </Typography>
        {order.items && order.items.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>
                      Rs. {parseFloat(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      Rs. {parseFloat(item.subtotal).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1">Total:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      Rs. {parseFloat(order.total_amount).toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No items found for this order.
          </Typography>
        )}

        {order.payment_slip && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Payment Slip
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={order.payment_slip}
                alt="Payment Slip"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                }}
              />
            </Box>
          </>
        )}

        {order.admin_notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Admin Notes
            </Typography>
            <Typography variant="body1">{order.admin_notes}</Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
