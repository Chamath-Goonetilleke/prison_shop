import { Button, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import ProductTable from "../../components/product/ProductTable";
import AddProductForm from "./AddProductForm";
import ProductView from "../../components/product/ProductView";

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
        margin: "1rem",
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
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Product Management</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProductClick}
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
