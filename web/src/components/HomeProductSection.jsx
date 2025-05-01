import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ProductCard from "./common/ProductCard";
import { Typography, CircularProgress } from "@mui/material";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import productService from "../services/productService";

export default function HomeProductSection({ category, color }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (category.id) {
          const data = await productService.getProductsByCategory(category.id);
          setProducts(data);
        }
      } catch (error) {
        console.error(
          `Error fetching products for category ${category.name}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category.id, category.name]);

  // Don't render the section if there are no products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: color,
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Box>
        <Typography fontSize={"25px"} fontWeight={"bold"}>
          {category.nameSi} ({category.nameEn})
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              overflowX: "auto",
              scrollBehavior: "smooth",
              whiteSpace: "nowrap",
              flexGrow: 1,
              maxWidth: "78%",
              gap: "25px",
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </Box>
          <Box
            position="relative"
            display="inline-block"
            sx={{ cursor: "pointer" }}
            onClick={() => (window.location = `/category/${category.id}`)}
          >
            <img
              src={category.image || `/cat-${category.code?.toLowerCase()}.png`}
              alt={category.name}
              style={{
                maxWidth: 250,
                minWidth: 250,
                maxHeight: 210,
                borderRadius: "10px",
                opacity: 0.6,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#2a6595",
                color: "white",
                fontWeight: "bold",
                fontSize: "21px",
                textAlign: "center",
                padding: "10px",
                width: "65%",
              }}
            >
              View More <ArrowForwardOutlinedIcon />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
