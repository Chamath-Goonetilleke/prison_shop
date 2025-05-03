import React, { useState } from "react";
import { Box, Tab, Tabs, Typography, Paper } from "@mui/material";
import BankDetailsManagement from "./BankDetailsManagement";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Helper function for tab accessibility
function a11yProps(index) {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`,
  };
}

export default function SettingsManagement() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
          >
            <Tab label="Bank Details" {...a11yProps(0)} />
            {/* Add more settings tabs as needed */}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <BankDetailsManagement />
        </TabPanel>
        {/* Add more TabPanels for other settings as needed */}
      </Paper>
    </Box>
  );
}
