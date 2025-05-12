import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  CircularProgress,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  InputAdornment,
  TablePagination,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import adminService from "../../services/adminService";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [prisons, setPrisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "prison_admin",
    prisonId: "",
    isActive: true,
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAdmins();
    fetchPrisons();
  }, []);

  useEffect(() => {
    // Filter admins based on search term
    if (searchTerm.trim() === "") {
      setFilteredAdmins(admins);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = admins.filter(
        (admin) =>
          `${admin.first_name} ${admin.last_name}`
            .toLowerCase()
            .includes(lowercasedSearch) ||
          (admin.email &&
            admin.email.toLowerCase().includes(lowercasedSearch)) ||
          (admin.role && admin.role.toLowerCase().includes(lowercasedSearch)) ||
          (admin.prison_name &&
            admin.prison_name.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredAdmins(filtered);
    }
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, admins]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllAdmins();
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to load admins. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrisons = async () => {
    try {
      setError(null);
      const data = await adminService.getAllPrisons();
      setPrisons(data);
    } catch (error) {
      console.error("Error fetching prisons:", error);
      setError("Failed to load prisons. Some features may be limited.");
    }
  };

  const handleOpenDialog = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        email: admin.email,
        password: "",
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
        prisonId: admin.prison_id || "",
        isActive: admin.is_active,
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "prison_admin",
        prisonId: "",
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAdmin(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (editingAdmin) {
        await adminService.updateAdmin(editingAdmin.id, formData);
      } else {
        await adminService.createAdmin(formData);
      }

      handleCloseDialog();
      fetchAdmins();
    } catch (error) {
      console.error("Error saving admin:", error);
      setError("Failed to save admin. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        setLoading(true);
        setError(null);
        await adminService.deleteAdmin(adminId);
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
        setError("Failed to delete admin. Please try again.");
        setLoading(false);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getRoleChip = (role) => {
    const color = role === "super_admin" ? "primary" : "info";
    const label = role === "super_admin" ? "Super Admin" : "Prison Admin";

    return <Chip label={label} color={color} size="small" />;
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
          borderRadius: "0 0 0.5rem 0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <AdminPanelSettingsIcon sx={{ fontSize: "1.8rem" }} />
        Admin Management
      </Typography>

      <Box sx={{ width: "100%", p: 2 }}>
        {loading && !openDialog && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
                alignItems: "center",
              }}
            >
              {/* Search bar */}
              <TextField
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ flexGrow: 1, mr: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search by name, email, role..."
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                size="large"
              >
                Add Admin
              </Button>
            </Box>

            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer sx={{ minHeight: "50vh" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Prison</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAdmins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No admins found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAdmins
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell>{`${admin.first_name} ${admin.last_name}`}</TableCell>
                            <TableCell>{admin.email}</TableCell>
                            <TableCell>{getRoleChip(admin.role)}</TableCell>
                            <TableCell>{admin.prison_name || "N/A"}</TableCell>
                            <TableCell>
                              {getStatusChip(admin.is_active)}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleOpenDialog(admin)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleDelete(admin.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
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
                count={filteredAdmins.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingAdmin ? "Edit Admin" : "Add New Admin"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required={!editingAdmin}
                helperText={
                  editingAdmin ? "Leave empty to keep current password" : ""
                }
              />
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                >
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="prison_admin">Prison Admin</MenuItem>
                </Select>
              </FormControl>
              {formData.role === "prison_admin" && (
                <FormControl fullWidth>
                  <InputLabel>Prison</InputLabel>
                  <Select
                    name="prisonId"
                    value={formData.prisonId}
                    onChange={handleInputChange}
                    label="Prison"
                  >
                    {prisons.map((prison) => (
                      <MenuItem key={prison.id} value={prison.id}>
                        {prison.nameEn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {editingAdmin && (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editingAdmin ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default AdminManagement;
