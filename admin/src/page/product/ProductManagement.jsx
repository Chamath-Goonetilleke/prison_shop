import { Button, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import ProductTable from "../../components/product/ProductTable";
import AddProductForm from "./AddProductForm";
import ProductView from "../../components/product/ProductView";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddIcon from "@mui/icons-material/Add";

export default function ProductManagement() {
  const [view, setView] = useState("list"); // list, add, edit, view
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProductClick = () => {
    setView("add");
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setView("edit");
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setView("view");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedProduct(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        
      }}
    >
      {view === "add" && <AddProductForm onBack={handleBackToList} />}

      {view === "edit" && (
        <AddProductForm
          onBack={handleBackToList}
          editProduct={selectedProduct}
          mode="edit"
        />
      )}

      {view === "view" && (
        <ProductView
          product={selectedProduct}
          onBack={handleBackToList}
          onEdit={() => setView("edit")}
        />
      )}

      {view === "list" && (
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
              <ShoppingBagIcon sx={{ fontSize: "1.8rem" }} />
              Product Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddProductClick}
              size="medium"
            >
              Add New Product
            </Button>
          </Box>
          <ProductTable onEdit={handleEditProduct} onView={handleViewProduct} />
        </>
      )}
    </div>
  );
}
