import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import customOrderService from "../services/customOrderService";
import OrderDetailsModal from "../components/order/OrderDetailsModal";
import CustomOrderDetailsModal from "../components/order/CustomOrderDetailsModal";

// Tab Panel component for switching between normal and custom orders
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customLoading, setCustomLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomOrder, setSelectedCustomOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [customOrderModalOpen, setCustomOrderModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [customError, setCustomError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchCustomOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getUserOrders(token);
      console.log("Regular orders fetched:", data);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomOrders = async () => {
    try {
      setCustomLoading(true);
      setCustomError(null);
      const data = await customOrderService.getUserCustomOrders(token);
      console.log("Custom orders fetched:", data);
      setCustomOrders(data);
    } catch (error) {
      console.error("Error fetching custom orders:", error);
      setCustomError(
        "Failed to load your custom orders. Please try again later."
      );
    } finally {
      setCustomLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const orderData = await orderService.getOrderById(orderId, token);
      setSelectedOrder(orderData);
      setOrderModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("Failed to load order details. Please try again.");
    }
  };

  const handleViewCustomOrderDetails = async (orderId) => {
    try {
      const customOrder = await customOrderService.getCustomOrderById(
        orderId,
        token
      );
      setSelectedCustomOrder(customOrder);
      setCustomOrderModalOpen(true);
    } catch (error) {
      console.error("Error fetching custom order details:", error);
      alert("Failed to load custom order details. Please try again.");
    }
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
  };

  const handleCloseCustomOrderModal = () => {
    setCustomOrderModalOpen(false);
  };

  // Function to get status chip with appropriate color
  const getStatusChip = (status) => {
    // For normal orders
    if (
      ["pending", "approved", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
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
    }
    // For custom orders
    else {
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
    }
  };

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Please log in to view your profile and orders.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{user.phone}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">{user.address}</Typography>
            </Box>
            <Button variant="outlined" fullWidth>
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Order History */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="order history tabs"
              >
                <Tab label="Regular Orders" id="order-tab-0" />
                <Tab label="Custom Orders" id="order-tab-1" />
              </Tabs>
            </Box>

            {/* Regular Orders Tab */}
            <TabPanel value={tabValue} index={0}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>Rs. {order.total_amount}</TableCell>
                            <TableCell>{getStatusChip(order.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewOrderDetails(order.id)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No regular orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            {/* Custom Orders Tab */}
            <TabPanel value={tabValue} index={1}>
              {customLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : customError ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {customError}
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customOrders.length > 0 ? (
                        customOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{order.category_name}</TableCell>
                            <TableCell>{getStatusChip(order.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  handleViewCustomOrderDetails(order.id)
                                }
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No custom orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={orderModalOpen}
        onClose={handleCloseOrderModal}
        order={selectedOrder}
      />

      {/* Custom Order Details Modal */}
      <CustomOrderDetailsModal
        open={customOrderModalOpen}
        onClose={handleCloseCustomOrderModal}
        order={selectedCustomOrder}
      />
    </Container>
  );
};

export default ProfilePage;
