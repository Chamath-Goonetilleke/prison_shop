import React, { useState } from "react";
import CategoryTable from "../../components/category/CategoryTable";
import CategoryForm from "../../components/category/CategoryForm";
import CategoryAttributesView from "../../components/category/CategoryAttributesView";
import { Button, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function CategoryManagement() {
  const [view, setView] = useState("table"); // 'table', 'form', 'attributes'
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddClick = () => {
    setSelectedCategory(null);
    setView("form");
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setView("form");
  };

  const handleViewAttributes = (category) => {
    setSelectedCategory(category);
    setView("attributes");
  };

  const handleBack = () => {
    setView("table");
    setSelectedCategory(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "1rem",
      }}
    >
      {view === "table" && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Category Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Add New Category
            </Button>
          </Box>
          <CategoryTable
            onEdit={handleEditClick}
            onViewAttributes={handleViewAttributes}
          />
        </>
      )}

      {view === "form" && (
        <CategoryForm onBack={handleBack} editCategory={selectedCategory} />
      )}

      {view === "attributes" && selectedCategory && (
        <CategoryAttributesView
          onBack={handleBack}
          category={selectedCategory}
        />
      )}
    </Box>
  );
}
