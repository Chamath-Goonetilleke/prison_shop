import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import bankDetailsService from "../services/bankDetailsService";
import productService from "../services/productService";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems: cart, clearCart, removeItem } = useCart();
  const { user, token } = useAuth();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [loadingBankDetails, setLoadingBankDetails] = useState(true);
  const [paymentSlipFile, setPaymentSlipFile] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [formData, setFormData] = useState({
    customer_name: user ? `${user.firstName} ${user.lastName}` : "",
    customer_email: user ? user.email : "",
    customer_phone: user ? user.phone : "",
    delivery_address: user ? user.address : "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [stockDialog, setStockDialog] = useState({
    open: false,
    unavailableItems: [],
  });

  // Update form data if user logs in during checkout
  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        customer_name:
          prevFormData.customer_name || `${user.firstName} ${user.lastName}`,
        customer_email: prevFormData.customer_email || user.email,
        customer_phone: prevFormData.customer_phone || user.phone,
        delivery_address: prevFormData.delivery_address || user.address,
      }));
    }
  }, [user]);

  // Calculate total amount when cart changes
  useEffect(() => {
    // Calculate total amount
    const total = cart.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    setTotalAmount(total);

    // Fetch bank details
    fetchBankDetails();
  }, [cart]);

  const fetchBankDetails = async () => {
    try {
      setLoadingBankDetails(true);
      const data = await bankDetailsService.getActiveBankDetails();
      setBankDetails(data);
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setNotification({
        open: true,
        message: "Failed to load bank details",
        severity: "error",
      });
    } finally {
      setLoadingBankDetails(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentSlipFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customer_name) {
      errors.customer_name = "Name is required";
    }
    if (!formData.customer_email) {
      errors.customer_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      errors.customer_email = "Email is invalid";
    }
    if (!formData.customer_phone) {
      errors.customer_phone = "Phone number is required";
    }
    if (!formData.delivery_address) {
      errors.delivery_address = "Delivery address is required";
    }
    if (!paymentSlipFile) {
      errors.payment_slip = "Payment slip is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle removing unavailable items
  const handleRemoveUnavailableItems = () => {
    // Remove each unavailable item from the cart
    stockDialog.unavailableItems.forEach((item) => {
      removeItem(item.product_id);
    });

    // Close the dialog
    setStockDialog({ open: false, unavailableItems: [] });

    setNotification({
      open: true,
      message: "Unavailable items removed from cart",
      severity: "info",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setNotification({
        open: true,
        message: "Your cart is empty",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);

      // First check stock availability
      const stockStatus = await productService.checkStockAvailability(cart);

      // If any items are unavailable, show dialog and stop checkout
      if (!stockStatus.allAvailable) {
        setStockDialog({
          open: true,
          unavailableItems: stockStatus.unavailableItems,
        });
        return;
      }

      // Prepare cart items for order submission
      const orderItems = cart.map((item) => ({
        product_id: item.id,
        product_name: item.name || item.nameEn,
        quantity: item.quantity,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.price) * item.quantity,
      }));

      // Create order data
      const orderData = {
        ...formData,
        total_amount: totalAmount,
        payment_slip: paymentSlipFile,
        items: orderItems,
      };

      // Add customer_id if user is logged in
      if (user && user.id) {
        orderData.customer_id = user.id;
      }

      // Submit order with authentication token if available
      const response = await orderService.createOrder(orderData, token);

      // Clear cart using CartContext
      clearCart();

      // Show success notification
      setNotification({
        open: true,
        message: `Order ${response.orderNumber} placed successfully! We will process your order soon.`,
        severity: "success",
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      setNotification({
        open: true,
        message:
          "Failed to place order: " +
          (error.response?.data?.message || error.message),
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      {cart.length === 0 ? (
        <Alert severity="info">
          Your cart is empty.{" "}
          <Button color="primary" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Customer Information Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Full Name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      error={!!formErrors.customer_name}
                      helperText={formErrors.customer_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Email Address"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      error={!!formErrors.customer_email}
                      helperText={formErrors.customer_email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Phone Number"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      error={!!formErrors.customer_phone}
                      helperText={formErrors.customer_phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Delivery Address"
                      name="delivery_address"
                      multiline
                      rows={3}
                      value={formData.delivery_address}
                      onChange={handleInputChange}
                      error={!!formErrors.delivery_address}
                      helperText={formErrors.delivery_address}
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Bank Details and Payment Upload */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              {loadingBankDetails ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : bankDetails.length === 0 ? (
                <Alert severity="warning">
                  No payment details available. Please contact customer service.
                </Alert>
              ) : (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Please transfer the total amount to one of the following
                    bank accounts:
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {bankDetails.map((bank) => (
                      <Grid item xs={12} md={6} key={bank.id}>
                        <Card variant="outlined">
                          <CardHeader title={bank.bank_name} />
                          <CardContent>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Account Name: {bank.account_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Account Number: {bank.account_number}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Branch: {bank.branch}
                            </Typography>
                            {bank.instructions && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bank.instructions}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="subtitle1" gutterBottom>
                    After making the payment, please upload your payment slip:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="payment-slip-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="payment-slip-upload">
                      <Button variant="outlined" component="span">
                        Upload Payment Slip
                      </Button>
                    </label>
                    {paymentSlipFile && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        File: {paymentSlipFile.name}
                      </Typography>
                    )}
                    {formErrors.payment_slip && (
                      <Typography
                        color="error"
                        variant="caption"
                        display="block"
                      >
                        {formErrors.payment_slip}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, position: "sticky", top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <List disablePadding>
                {cart.map((item) => (
                  <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                    <ListItemText
                      primary={item.nameEn}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body2">
                      Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
                <Divider sx={{ my: 2 }} />
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Total" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Rs. {totalAmount.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={loading || loadingBankDetails}
                onClick={handleSubmit}
              >
                {loading ? <CircularProgress size={24} /> : "Place Order"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Stock Availability Dialog */}
      <Dialog
        open={stockDialog.open}
        onClose={() => setStockDialog({ open: false, unavailableItems: [] })}
      >
        <DialogTitle>Out of Stock Items</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Some items in your cart are no longer available:
          </DialogContentText>
          <List>
            {stockDialog.unavailableItems.map((item) => (
              <ListItem key={item.product_id}>
                <ListItemText
                  primary={item.product_name}
                  secondary={
                    item.reason === "Out of stock"
                      ? "This item is out of stock"
                      : `Only ${item.available} available (you requested ${item.requested})`
                  }
                />
              </ListItem>
            ))}
          </List>
          <DialogContentText sx={{ mt: 2 }}>
            Please remove these items from your cart to proceed with checkout.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setStockDialog({ open: false, unavailableItems: [] })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveUnavailableItems}
            color="primary"
            variant="contained"
          >
            Remove Unavailable Items
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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
    </Container>
  );
};

export default CheckoutPage;
