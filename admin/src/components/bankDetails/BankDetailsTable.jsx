import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import bankDetailsService from "../../services/bankDetailsService";

const BankDetailsTable = ({ onEdit, onAdd }) => {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankDetailsToDelete, setBankDetailsToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const data = await bankDetailsService.getAllBankDetails();
      setBankDetails(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch bank details:", err);
      setError("Failed to load bank details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (bankDetail) => {
    if (onEdit) {
      onEdit(bankDetail);
    }
  };

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    }
  };

  const handleDeleteClick = (bankDetail) => {
    setBankDetailsToDelete(bankDetail);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bankDetailsToDelete) return;

    try {
      await bankDetailsService.deleteBankDetails(bankDetailsToDelete.id);

      // Update the list
      fetchBankDetails();

      setNotification({
        open: true,
        message: "Bank details deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting bank details:", error);
      setNotification({
        open: true,
        message:
          "Error deleting bank details: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBankDetailsToDelete(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Bank Account Details</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add New Bank Account
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: "75vh" }}>
        <Table stickyHeader aria-label="bank details table">
          <TableHead>
            <TableRow>
              <TableCell>Bank Name</TableCell>
              <TableCell>Account Name</TableCell>
              <TableCell>Account Number</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No bank details found. Click "Add New Bank Account" to create
                  one.
                </TableCell>
              </TableRow>
            ) : (
              bankDetails.map((bankDetail) => (
                <TableRow key={bankDetail.id}>
                  <TableCell>{bankDetail.bank_name}</TableCell>
                  <TableCell>{bankDetail.account_name}</TableCell>
                  <TableCell>{bankDetail.account_number}</TableCell>
                  <TableCell>{bankDetail.branch}</TableCell>
                  <TableCell>
                    <Chip
                      label={bankDetail.active ? "Active" : "Inactive"}
                      color={bankDetail.active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(bankDetail)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(bankDetail)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Bank Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the bank account details for{" "}
            {bankDetailsToDelete?.bank_name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
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
    </Paper>
  );
};

export default BankDetailsTable;
