import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ProductCard from "./common/ProductCard";
import {
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import productService from "../services/productService";

export default function HomeProductSection({ category, color }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
        padding: { xs: "10px", sm: "15px", md: "20px" },
        borderRadius: "10px",
      }}
    >
      <Box>
        <Typography
          fontSize={{ xs: "18px", sm: "22px", md: "25px" }}
          fontWeight={"bold"}
        >
          {category.nameSi} ({category.nameEn})
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: "15px", md: "0" },
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-start",
              padding: "10px",
              overflowX: "auto",
              scrollBehavior: "smooth",
              whiteSpace: "nowrap",
              flexGrow: 1,
              maxWidth: isMobile ? "100%" : isTablet ? "90%" : "78%",
              gap: isMobile ? "10px" : "25px",
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
            sx={{
              cursor: "pointer",
              width: { xs: "100%", md: "auto" },
              textAlign: { xs: "center", md: "left" },
            }}
            onClick={() => (window.location = `/category/${category.id}`)}
          >
            <img
              src={
                category.image ||
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
              }
              alt={category.name}
              style={{
                maxWidth: isMobile ? "100%" : 250,
                minWidth: isMobile ? "auto" : 250,
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
                fontSize: { xs: "16px", sm: "18px", md: "21px" },
                textAlign: "center",
                padding: { xs: "8px", md: "10px" },
                width: { xs: "75%", md: "65%" },
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
