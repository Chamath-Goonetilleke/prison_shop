import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import SubCategoryTable from "../../components/category/SubCategoryTable";
import SubCategoryForm from "../../components/category/SubCategoryForm";

export default function SubCategoryManagement() {
  const [view, setView] = useState("list"); // list, add, edit
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleAddClick = () => {
    setSelectedSubCategory(null);
    setView("add");
  };

  const handleEditClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedSubCategory(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      {view === "list" && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Sub-Category Management</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClick}
            >
              Add New Sub-Category
            </Button>
          </Box>
          <SubCategoryTable onEdit={handleEditClick} />
        </>
      )}

      {(view === "add" || view === "edit") && (
        <SubCategoryForm
          onBack={handleBack}
          editSubCategory={selectedSubCategory}
          mode={view}
        />
      )}
    </Box>
  );
}
