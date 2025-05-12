import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import customOrderService from "../../services/customOrderService";
import prisonService from "../../services/prisonService";
import categoryService from "../../services/categoryService";

const CustomOrderForm = () => {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    customer_name: user ? `${user.firstName} ${user.lastName}` : "",
    customer_email: user ? user.email : "",
    customer_phone: user ? user.phone || "" : "",
    delivery_address: user ? user.address || "" : "",
    category_id: "",
    subcategory_id: "",
    prison_id: "",
    requirements: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [prisons, setPrisons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch categories and prisons on component mount
  useEffect(() => {
    fetchCategories();
    fetchPrisons();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (formData.category_id) {
      fetchSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    }
  };

  const fetchPrisons = async () => {
    try {
      const activePrisons = await prisonService.getActivePrisons();
      setPrisons(activePrisons);
    } catch (err) {
      console.error("Error fetching prisons:", err);
      setError("Failed to load prisons. Please try again later.");
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const subcategoriesData =
        await categoryService.getSubcategoriesByCategory(categoryId);
      setSubcategories(subcategoriesData);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.customer_name.trim()) {
      errors.customer_name = "Name is required";
    }

    if (!formData.customer_email.trim()) {
      errors.customer_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      errors.customer_email = "Email is invalid";
    }

    if (!formData.customer_phone.trim()) {
      errors.customer_phone = "Phone number is required";
    }

    if (!formData.delivery_address.trim()) {
      errors.delivery_address = "Delivery address is required";
    }

    if (!formData.category_id) {
      errors.category_id = "Category is required";
    }

    if (!formData.prison_id) {
      errors.prison_id = "Prison is required";
    }

    if (!formData.requirements.trim()) {
      errors.requirements = "Requirements are required";
    } else if (formData.requirements.trim().length < 10) {
      errors.requirements =
        "Please provide detailed requirements (at least 10 characters)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create custom order data with user ID if user is logged in
      const customOrderData = {
        ...formData,
      };

      // Add customer_id if user is logged in
      if (user && user.id) {
        customOrderData.customer_id = user.id;
      }

      // Pass the data along with auth token
      await customOrderService.createCustomOrder(customOrderData, token);
      setSuccess(true);

      // Reset form (except user info)
      setFormData({
        ...formData,
        category_id: "",
        subcategory_id: "",
        prison_id: "",
        requirements: "",
      });

      setFormErrors({});
    } catch (err) {
      console.error("Error submitting custom order:", err);
      setError(
        typeof err === "string"
          ? err
          : "Failed to submit your custom order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" fontWeight={"bold"} gutterBottom>
        Request Custom Order
      </Typography>

      <Typography variant="body1" paragraph>
        Need something custom-made? Let us know your requirements and we'll make
        it happen!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Your custom order request has been submitted successfully! We'll
          review it and get back to you soon.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.customer_name}
              helperText={formErrors.customer_name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Email"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.customer_email}
              helperText={formErrors.customer_email}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Phone Number"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.customer_phone}
              helperText={formErrors.customer_phone}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              margin="normal"
              error={!!formErrors.category_id}
            >
              <InputLabel id="category-label">Category *</InputLabel>
              <Select
                labelId="category-label"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Category *"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.nameSi} ({category.nameEn})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.category_id && (
                <FormHelperText>{formErrors.category_id}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="subcategory-label">
                Subcategory (Optional)
              </InputLabel>
              <Select
                labelId="subcategory-label"
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleChange}
                label="Subcategory (Optional)"
                disabled={!formData.category_id || subcategories.length === 0}
              >
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.nameSi} ({subcategory.nameEn})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              margin="normal"
              error={!!formErrors.prison_id}
            >
              <InputLabel id="prison-label">Prison *</InputLabel>
              <Select
                labelId="prison-label"
                name="prison_id"
                value={formData.prison_id}
                onChange={handleChange}
                label="Prison *"
              >
                {prisons.map((prison) => (
                  <MenuItem key={prison.id} value={prison.id}>
                    {prison.nameSi
                      ? `${prison.nameEn} (${prison.nameSi})`
                      : prison.nameEn}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.prison_id && (
                <FormHelperText>{formErrors.prison_id}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Delivery Address"
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
              error={!!formErrors.delivery_address}
              helperText={formErrors.delivery_address}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Custom Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={5}
              placeholder="Please describe in detail what you need. Include dimensions, materials, colors, design preferences, or any other specific requirements."
              error={!!formErrors.requirements}
              helperText={formErrors.requirements}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Submit Custom Order Request"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CustomOrderForm;
