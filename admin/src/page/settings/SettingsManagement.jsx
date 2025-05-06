import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import BankDetailsManagement from "./BankDetailsManagement";
import UserManagement from "./UserManagement";
import AdminManagement from "./AdminManagement";
import PrisonManagement from "../../components/prison/PrisonManagement";
import axios from "axios";

const SettingsManagement = ({isSuperAdmin}) => {
  const [value, setValue] = useState(0);


  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Bank Details" />
          <Tab label="Prison Management" />
          {isSuperAdmin && <Tab label="Admin Management" />}
        </Tabs>
      </Paper>

      {value === 0 && <BankDetailsManagement />}
      {value === 1 && <PrisonManagement />}
      {value === 2 && isSuperAdmin && <AdminManagement />}
    </Box>
  );
};

export default SettingsManagement;
