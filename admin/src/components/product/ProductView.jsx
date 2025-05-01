import React, { useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { Add, Remove } from "@mui/icons-material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

// Helper function to extract filename from path
const getFilenameFromPath = (path) => {
  if (!path) return "";
  return path.split("/").pop().split("\\").pop();
};

const ProductView = ({ product, onBack, onEdit }) => {
  const scrollContainerRef = useRef(null);

  if (!product) {
    return <Typography>No product selected</Typography>;
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Format price with currency
  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

  // Check if the product has attributes
  const hasAttributes =
    product.attributes && Object.keys(product.attributes).length > 0;

  return (
    <Paper sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={onBack}
            sx={{ cursor: "pointer" }}
          >
            Products
          </Link>
          {/* Show category if available */}
          {(product.categoryName || product.type) && (
            <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }}>
              {product.categoryName || product.type}
            </Link>
          )}
          {/* Show subcategory if available */}
          {(product.subCategoryName ||
            (product.attributes && product.attributes.subCategory)) && (
            <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }}>
              {product.subCategoryName || product.attributes.subCategory}
            </Link>
          )}
          <Typography color="text.primary">{product.nameEn}</Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => onEdit(product)}
        >
          Edit Product
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "20px",
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        {/* Left side - Images */}
        <Box sx={{ flex: 1.3, minWidth: { xs: "100%", md: "auto" } }}>
          {/* Main Image */}
          <Box
            component="img"
            src={
              product.mainImage
                ? `http://localhost:8080/uploads/products/${getFilenameFromPath(product.mainImage)}`
                : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
            }
            alt={product.nameEn}
            sx={{
              width: "100%",
              borderRadius: "10px",
              maxHeight: "500px",
              objectFit: "contain",
              mb: 2,
            }}
          />

          {/* Image Carousel */}
          {product.additionalImages && product.additionalImages.length > 0 && (
            <Box
              sx={{ display: "flex", alignItems: "center", maxWidth: "100%" }}
            >
              {/* Left Arrow Button */}
              <IconButton
                onClick={() => scroll("left")}
                disabled={!product.additionalImages?.length}
              >
                <ArrowCircleLeftOutlinedIcon fontSize="large" />
              </IconButton>

              {/* Scrollable Image Container */}
              <Box
                ref={scrollContainerRef}
                sx={{
                  display: "flex",
                  padding: "10px",
                  overflowX: "hidden",
                  scrollBehavior: "smooth",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                }}
              >
                {/* Show main image in carousel too */}
                <Box
                  component="img"
                  src={
                    product.mainImage
                      ? `http://localhost:8080/uploads/products/${getFilenameFromPath(product.mainImage)}`
                      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
                  }
                  alt={product.nameEn}
                  sx={{
                    maxWidth: "120px",
                    height: "120px",
                    marginRight: "10px",
                    objectFit: "cover",
                  }}
                />

                {/* Additional images */}
                {product.additionalImages.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={`http://localhost:8080/uploads/products/${getFilenameFromPath(image)}`}
                    alt={`${product.nameEn} - image ${index + 1}`}
                    sx={{
                      maxWidth: "120px",
                      height: "120px",
                      marginRight: "10px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </Box>

              {/* Right Arrow Button */}
              <IconButton
                onClick={() => scroll("right")}
                disabled={!product.additionalImages?.length}
              >
                <ArrowCircleRightOutlinedIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Right side - Product Info */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            ml: { md: "2rem" },
            mt: { xs: 2, md: 0 },
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {product.nameEn}
            </Typography>
            {product.nameSi && (
              <Typography variant="h6" color="text.secondary">
                {product.nameSi}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={product.status}
              color={product.status === "In Stock" ? "success" : "error"}
            />
            <Chip
              label={product.active === "Yes" ? "Active" : "Inactive"}
              color={product.active === "Yes" ? "primary" : "default"}
            />
            {product.category_id && (
              <Chip label={product.categoryName || product.type} color="info" />
            )}
          </Box>

          <Typography variant="h6" fontWeight="bold" color="primary">
            {formatPrice(product.price)}
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" color="text.secondary">
              Product Code:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {product.productCode}
            </Typography>
          </Box>

          {product.stock !== undefined && (
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body1" color="text.secondary">
                Stock Quantity:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton disabled size="small">
                  <Remove />
                </IconButton>
                <TextField
                  value={product.stock}
                  size="small"
                  inputProps={{ readOnly: true }}
                  sx={{ width: "60px", mx: 1 }}
                />
                <IconButton disabled size="small">
                  <Add />
                </IconButton>
              </Box>
            </Box>
          )}

          <Divider />

          {/* Description */}
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Description
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, textAlign: "justify" }}>
              {product.description || "No description available."}
            </Typography>
          </Box>

          {/* Product Attributes */}
          {hasAttributes && (
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Product Attributes
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 2,
                }}
              >
                {Object.entries(product.attributes).map(([key, value]) => (
                  <Box key={key}>
                    <Typography variant="body2" color="text.secondary">
                      {key}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {Array.isArray(value) ? value.join(", ") : value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Action Buttons (just for display - would be functional in the web version) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              disabled
              sx={{
                backgroundColor: "green",
                color: "white",
                height: "3rem",
                "&.Mui-disabled": {
                  backgroundColor: "rgba(0, 128, 0, 0.7)",
                  color: "white",
                },
              }}
            >
              ADD TO CART
            </Button>
            <Button variant="outlined" disabled sx={{ height: "3rem" }}>
              BUY IT NOW
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductView;
