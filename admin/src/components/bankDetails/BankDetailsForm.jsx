import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import bankDetailsService from "../../services/bankDetailsService";

const BankDetailsForm = ({ bankDetails, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
    branch: "",
    instructions: "",
    active: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Populate form with existing data if editing
  useEffect(() => {
    if (bankDetails) {
      setFormData({
        bank_name: bankDetails.bank_name || "",
        account_name: bankDetails.account_name || "",
        account_number: bankDetails.account_number || "",
        branch: bankDetails.branch || "",
        instructions: bankDetails.instructions || "",
        active: bankDetails.active === undefined ? true : bankDetails.active,
      });
    }
  }, [bankDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "Bank name is required";
    }
    if (!formData.account_name.trim()) {
      newErrors.account_name = "Account name is required";
    }
    if (!formData.account_number.trim()) {
      newErrors.account_number = "Account number is required";
    }
    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // If editing existing bank details
      if (bankDetails && bankDetails.id) {
        await bankDetailsService.updateBankDetails(bankDetails.id, formData);
        setNotification({
          open: true,
          message: "Bank details updated successfully",
          severity: "success",
        });
      } 
      // If creating new bank details
      else {
        await bankDetailsService.createBankDetails(formData);
        setNotification({
          open: true,
          message: "Bank details created successfully",
          severity: "success",
        });
      }
      
      // Call onSave callback
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving bank details:", error);
      setNotification({
        open: true,
        message: `Error: ${error.response?.data?.message || error.message}`,
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
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {bankDetails && bankDetails.id ? "Edit Bank Details" : "Add New Bank Details"}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Bank Name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleInputChange}
              error={!!errors.bank_name}
              helperText={errors.bank_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Account Name"
              name="account_name"
              value={formData.account_name}
              onChange={handleInputChange}
              error={!!errors.account_name}
              helperText={errors.account_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Account Number"
              name="account_number"
              value={formData.account_number}
              onChange={handleInputChange}
              error={!!errors.account_number}
              helperText={errors.account_number}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              error={!!errors.branch}
              helperText={errors.branch}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Instructions (Optional)"
              name="instructions"
              multiline
              rows={3}
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Add any special instructions for payment..."
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="active"
                  checked={formData.active}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="Active (Show this account on checkout page)"
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Grid>
        </Grid>
      </form>
      
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
    </Paper>
  );
};

export default BankDetailsForm; 