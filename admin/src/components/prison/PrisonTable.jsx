import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import prisonService from "../../services/prisonService";

// Helper function to ensure valid severity values
const getSafeSeverity = (severity) => {
  const validSeverities = ["error", "warning", "info", "success"];
  return validSeverities.includes(String(severity)) ? severity : "info";
};

const columns = [
  { id: "prison_no", label: "Prison No", minWidth: 100 },
  { id: "nameEn", label: "Name (English)", minWidth: 150 },
  { id: "nameSi", label: "Name (Sinhala)", minWidth: 150 },
  { id: "location", label: "Location", minWidth: 150 },
  { id: "contact", label: "Contact", minWidth: 120 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150 },
];

const PrisonTable = ({
  prisons,
  loading,
  error,
  onEdit,
  onView,
  onRefresh,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPrisons, setFilteredPrisons] = useState(prisons);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prisonToDelete, setPrisonToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Update filtered prisons when prisons prop changes
  useEffect(() => {
    handleSearch();
  }, [prisons, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPrisons(prisons);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = prisons.filter(
      (prison) =>
        prison.nameEn.toLowerCase().includes(lowercasedSearch) ||
        (prison.nameSi &&
          prison.nameSi.toLowerCase().includes(lowercasedSearch)) ||
        prison.prison_no.toLowerCase().includes(lowercasedSearch) ||
        (prison.location &&
          prison.location.toLowerCase().includes(lowercasedSearch))
    );

    setFilteredPrisons(filtered);
    setPage(0);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteClick = (prison) => {
    setPrisonToDelete(prison);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!prisonToDelete) return;

    try {
      await prisonService.deletePrison(prisonToDelete.id);

      setNotification({
        open: true,
        message: "Prison deleted successfully",
        severity: "success",
      });

      // Refresh the prison list
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting prison:", error);
      setNotification({
        open: true,
        message: "Error deleting prison",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPrisonToDelete(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status}
        color={status === "Active" ? "success" : "error"}
        size="small"
      />
    );
  };

  return (
    <Box>
      {/* Search bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          placeholder="Search by number, name or location..."
        />
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ minHeight: "50vh" }}>
          <Table stickyHeader aria-label="sticky table">
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
              {filteredPrisons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No prisons found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrisons
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((prison) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={prison.id}
                      >
                        <TableCell>{prison.prison_no}</TableCell>
                        <TableCell>{prison.nameEn}</TableCell>
                        <TableCell>{prison.nameSi || "-"}</TableCell>
                        <TableCell>{prison.location || "-"}</TableCell>
                        <TableCell>{prison.contact || "-"}</TableCell>
                        <TableCell>{getStatusChip(prison.status)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex" }}>
                            
                            <Tooltip title="Edit Prison">
                              <IconButton
                                color="info"
                                onClick={() => onEdit(prison)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Prison">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(prison)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPrisons.length}
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
        <DialogTitle>Delete Prison</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the prison "{prisonToDelete?.nameEn}
            "? This action cannot be undone.
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
          severity={getSafeSeverity(notification.severity)}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrisonTable;
