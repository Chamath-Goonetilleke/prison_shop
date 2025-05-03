import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import BankDetailsTable from "../../components/bankDetails/BankDetailsTable";
import BankDetailsForm from "../../components/bankDetails/BankDetailsForm";

export default function BankDetailsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [currentBankDetails, setCurrentBankDetails] = useState(null);

  // Handle edit bank details
  const handleEditBankDetails = (bankDetails) => {
    setCurrentBankDetails(bankDetails);
    setShowForm(true);
  };

  // Handle add new bank details
  const handleAddBankDetails = () => {
    setCurrentBankDetails(null);
    setShowForm(true);
  };

  // Handle form save (create/update)
  const handleFormSave = () => {
    setShowForm(false);
    setCurrentBankDetails(null);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentBankDetails(null);
  };

  return (
    <Box>
      {showForm ? (
        <BankDetailsForm
          bankDetails={currentBankDetails}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      ) : (
        <BankDetailsTable
          onEdit={handleEditBankDetails}
          onAdd={handleAddBankDetails}
        />
      )}
    </Box>
  );
}
