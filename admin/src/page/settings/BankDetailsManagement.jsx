import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BankDetailsTable from "../../components/bankDetails/BankDetailsTable";
import BankDetailsForm from "../../components/bankDetails/BankDetailsForm";
import bankDetailsService from "../../services/bankDetailsService";

export default function BankDetailsManagement() {
  const [view, setView] = useState("list"); // list, add, edit
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);

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

  const handleAddClick = () => {
    setSelectedBankDetails(null);
    setView("add");
  };

  const handleEditClick = (bankDetail) => {
    setSelectedBankDetails(bankDetail);
    setView("edit");
  };

  const handleBackToList = () => {
    setView("list");
    fetchBankDetails(); // Refresh the list after adding/editing
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#27548A",
          borderRadius: "0 0 0.5rem 0.5rem",
          padding: "0.5rem",
          py: "1rem",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={"bold"}
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <AccountBalanceIcon sx={{ fontSize: "1.8rem" }} />
          Bank Details Management
        </Typography>
        {view === "list" && !loading && !error && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            size="medium"
          >
            Add New Bank Details
          </Button>
        )}
      </Box>

      <Box sx={{ width: "100%", p: 2 }}>
        {loading && view === "list" && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {view === "list" && !loading && (
          <BankDetailsTable
            bankDetails={bankDetails}
            loading={false}
            error={null}
            onEdit={handleEditClick}
            onRefresh={fetchBankDetails}
          />
        )}

        {(view === "add" || view === "edit") && (
          <BankDetailsForm
            bankDetails={selectedBankDetails}
            mode={view}
            onSave={handleBackToList}
            onCancel={handleBackToList}
          />
        )}
      </Box>
    </>
  );
}
