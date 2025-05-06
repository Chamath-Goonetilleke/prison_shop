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
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [prisons, setPrisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "prison_admin",
    prisonId: "",
  });

  useEffect(() => {
    fetchAdmins();
    fetchPrisons();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "http://localhost:8080/api/management/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmins(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
    }
  };

  const fetchPrisons = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:8080/api/prisons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrisons(response.data);
    } catch (error) {
      console.error("Error fetching prisons:", error);
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
        prisonId: admin.prison_id,
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
      const token = localStorage.getItem("adminToken");
      if (editingAdmin) {
        await axios.patch(
          `http://localhost:8080/api/management/admins/${editingAdmin.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/management/admins",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      handleCloseDialog();
      fetchAdmins();
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(
          `http://localhost:8080/api/management/admins/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Admin Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Admin
        </Button>
      </Box>

      <TableContainer component={Paper}>
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
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{`${admin.first_name} ${admin.last_name}`}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>{admin.prison_name || "N/A"}</TableCell>
                <TableCell>{admin.is_active ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog(admin)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(admin.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAdmin ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagement;
