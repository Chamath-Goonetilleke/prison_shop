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
  TextField,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import bankDetailsService from "../../services/bankDetailsService";

const columns = [
  { id: "bank_name", label: "Bank Name", minWidth: 120 },
  { id: "account_name", label: "Account Name", minWidth: 150 },
  { id: "account_number", label: "Account Number", minWidth: 120 },
  { id: "branch", label: "Branch", minWidth: 120 },
  { id: "instructions", label: "Instructions", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

const BankDetailsTable = ({
  bankDetails,
  loading,
  error,
  onEdit,
  onRefresh,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBankDetails, setFilteredBankDetails] = useState(
    bankDetails || []
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankDetailsToDelete, setBankDetailsToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Update filtered bank details when props change
  useEffect(() => {
    handleSearch();
  }, [bankDetails, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBankDetails(bankDetails || []);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = (bankDetails || []).filter(
      (bankDetail) =>
        bankDetail.bank_name.toLowerCase().includes(lowercasedSearch) ||
        bankDetail.account_name.toLowerCase().includes(lowercasedSearch) ||
        bankDetail.account_number.toLowerCase().includes(lowercasedSearch) ||
        (bankDetail.branch &&
          bankDetail.branch.toLowerCase().includes(lowercasedSearch))
    );

    setFilteredBankDetails(filtered);
    setPage(0);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEditClick = (bankDetail) => {
    if (onEdit) {
      onEdit(bankDetail);
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

      setNotification({
        open: true,
        message: "Bank details deleted successfully",
        severity: "success",
      });

      // Refresh the list
      if (onRefresh) {
        onRefresh();
      }
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

  const getStatusChip = (isActive) => {
    return (
      <Chip
        label={isActive ? "Active" : "Inactive"}
        color={isActive ? "success" : "error"}
        size="small"
      />
    );
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
    <Box>
      {/* Search bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          sx={{ flexGrow: 1, mr: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          placeholder="Search by bank name, account name or number..."
        />
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ minHeight: "50vh" }}>
          <Table stickyHeader aria-label="bank details table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBankDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No bank details found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBankDetails
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((bankDetail) => (
                    <TableRow key={bankDetail.id} hover>
                      <TableCell>{bankDetail.bank_name}</TableCell>
                      <TableCell>{bankDetail.account_name}</TableCell>
                      <TableCell>{bankDetail.account_number}</TableCell>
                      <TableCell>{bankDetail.branch || "-"}</TableCell>
                      <TableCell>
                        {bankDetail.instructions
                          ? bankDetail.instructions.length > 50
                            ? `${bankDetail.instructions.substring(0, 50)}...`
                            : bankDetail.instructions
                          : "-"}
                      </TableCell>
                      <TableCell>{getStatusChip(bankDetail.active)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Edit Bank Details">
                            <IconButton
                              color="info"
                              onClick={() => handleEditClick(bankDetail)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Bank Details">
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBankDetails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

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
    </Box>
  );
};

export default BankDetailsTable;
