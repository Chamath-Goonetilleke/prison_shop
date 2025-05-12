import React, { useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import OrdersTable from "../../components/order/OrdersTable";
import OrderDetails from "../../components/order/OrderDetails";
import orderService from "../../services/orderService";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle viewing order details - fetch complete order with items
  const handleViewOrder = async (order) => {
    try {
      setLoading(true);
      setError(null);
      // Fetch the complete order with items
      const completeOrder = await orderService.getOrderById(order.id);
      setSelectedOrder(completeOrder);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError(`Failed to load order details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to the orders list
  const handleBackToList = () => {
    setSelectedOrder(null);
    setError(null);
  };

  // Handle order update
  const handleOrderUpdated = (updatedOrder) => {
    setSelectedOrder(updatedOrder);
  };

  return (
    <>
      <Typography
        variant="h5"
        fontWeight={"bold"}
        sx={{
          mb: 3,
          backgroundColor: "#27548A",
          color: "white",
          padding: "0.5rem",
          py: "1rem",
          borderRadius: "0 0 0.5rem 0.5rem ",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: "1.8rem" }} />
        Order Management
      </Typography>
      <Box sx={{ width: "100%", p: 2 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onClose={handleBackToList}
            onOrderUpdated={handleOrderUpdated}
          />
        ) : (
          !loading && <OrdersTable onView={handleViewOrder} />
        )}
      </Box>
    </>
  );
}
