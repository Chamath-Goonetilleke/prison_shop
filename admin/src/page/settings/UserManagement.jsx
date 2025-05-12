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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  TablePagination,
  Chip,
  Alert,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import userService from "../../services/userService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(lowercasedSearch) ||
          (user.email && user.email.toLowerCase().includes(lowercasedSearch)) ||
          (user.phone && user.phone.toLowerCase().includes(lowercasedSearch)) ||
          (user.address &&
            user.address.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredUsers(filtered);
    }
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      setLoading(true);
      await userService.toggleUserBlockStatus(userId, isBlocked);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user status:", error);
      setError("Failed to update user status. Please try again.");
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
        <PersonIcon sx={{ fontSize: "1.8rem" }} />
        User Management
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

        {!loading && (
          <>
            {/* Search bar */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TextField
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ flexGrow: 1, mr: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search by name, email, phone..."
              />
            </Box>

            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Joined Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone || "-"}</TableCell>
                            <TableCell>{user.address || "-"}</TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.is_blocked ? "Blocked" : "Active"}
                                color={user.is_blocked ? "error" : "success"}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  user.is_blocked
                                    ? "Unblock User"
                                    : "Block User"
                                }
                              >
                                <IconButton
                                  onClick={() =>
                                    handleBlockUser(user.id, user.is_blocked)
                                  }
                                  color={user.is_blocked ? "success" : "error"}
                                >
                                  {user.is_blocked ? (
                                    <CheckCircleIcon />
                                  ) : (
                                    <BlockIcon />
                                  )}
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
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}
      </Box>
    </>
  );
};

export default UserManagement;
