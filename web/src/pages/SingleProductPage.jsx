import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Typography,
  IconButton,
  TextField,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Breadcrumb from "../components/common/BreadCrumb";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

const SingleProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollContainerRef = useRef(null);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Fetch product
        const productData = await productService.getProductById(productId);
        setProduct(productData);
        setSelectedImage(productData.mainImage);

        // Fetch category if product has category_id
        if (productData.category_id) {
          try {
            const categories = await categoryService.getAllCategories();
            const foundCategory = categories.find(
              (cat) => cat.id === productData.category_id
            );
            if (foundCategory) {
              setCategory(foundCategory);
            }
          } catch (err) {
            console.error("Error fetching category:", err);
          }
        }

        // Fetch subcategory if product has subCategory_id
        if (productData.subCategory_id) {
          try {
            const subcategories = await categoryService.getAllSubcategories();
            const foundSubcategory = subcategories.find(
              (subcat) => subcat.id === productData.subCategory_id
            );
            if (foundSubcategory) {
              setSubcategory(foundSubcategory);
            }
          } catch (err) {
            console.error("Error fetching subcategory:", err);
          }
        }

        setError(null);
      } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (price && !isNaN(parseFloat(price))) {
      return parseFloat(price).toFixed(2);
    }
    return "0.00";
  };

  // Helper function to get filename from path
  const getFilenameFromPath = (path) => {
    if (!path) return "";
    return path.split("/").pop().split("\\").pop();
  };

  // Handler for clicking on a thumbnail
  const handleThumbnailClick = (imagePath) => {
    setSelectedImage(imagePath);
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
          minHeight: "70vh",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error || "Product not found"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const mainImageUrl = selectedImage
    ? `http://localhost:8080/uploads/products/${getFilenameFromPath(
        selectedImage
      )}`
    : product.mainImage
    ? `http://localhost:8080/uploads/products/${getFilenameFromPath(
        product.mainImage
      )}`
    : "/bed.jpg";

  // Prepare attributes list for display
  const productAttributes = product.attributes ? product.attributes : {};
  const hasAttributes = Object.keys(productAttributes).length > 0;

  return (
    <div style={{ margin: "3rem" }}>
      <Breadcrumb
        category={category}
        subcategory={subcategory}
        product={product}
      />

      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {/* Left side - Images */}
        <div style={{ flex: 1.3 }}>
          <img
            src={mainImageUrl}
            alt={product.nameEn}
            style={{ width: "100%", borderRadius: "10px", maxHeight: "70vh" }}
          />

          {product.additionalImages && product.additionalImages.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "95vh",
              }}
            >
              {/* Left Arrow Button */}
              <button
                onClick={() => scroll("left")}
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                }}
              >
                <ArrowCircleLeftOutlinedIcon fontSize="large" />
              </button>

              {/* Scrollable Image Container */}
              <div
                ref={scrollContainerRef}
                style={{
                  display: "flex",
                  padding: "10px",
                  overflowX: "hidden",
                  scrollBehavior: "smooth",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                  gap: "10px",
                }}
              >
                {/* Main image thumbnail */}
                <img
                  src={`http://localhost:8080/uploads/products/${getFilenameFromPath(
                    product.mainImage
                  )}`}
                  alt={product.nameEn}
                  onClick={() => handleThumbnailClick(product.mainImage)}
                  style={{
                    minWidth: "150px",
                    maxWidth: "150px",
                    cursor: "pointer",
                    border:
                      selectedImage === product.mainImage
                        ? "2px solid #1976d2"
                        : "none",
                    borderRadius: "5px",
                  }}
                />

                {/* Additional images */}
                {product.additionalImages.map((imagePath, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8080/uploads/products/${getFilenameFromPath(
                      imagePath
                    )}`}
                    alt={`${product.nameEn} -${index + 1}`}
                    onClick={() => handleThumbnailClick(imagePath)}
                    style={{
                      minWidth: "150px",
                      maxWidth: "150px",
                      cursor: "pointer",
                      border:
                        selectedImage === imagePath
                          ? "2px solid #1976d2"
                          : "none",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => scroll("right")}
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                }}
              >
                <ArrowCircleRightOutlinedIcon fontSize="large" />
              </button>
            </div>
          )}
        </div>

        {/* Right side - Product details */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            marginLeft: "2rem",
            gap: "30px",
          }}
        >
          <div>
            <Typography variant="h4" fontWeight="bold">
              {product.nameSi && product.nameSi} ({product.nameEn})
            </Typography>
            <Typography sx={{ py: "0.5rem" }}>
              <strong>Product Code: {product.productCode}</strong>
            </Typography>
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                label={product.status || "In Stock"}
                color={product.status === "Out of Stock" ? "error" : "success"}
                size="medium"
              />
              {product.stock > 0
                ? `${product.stock} units in stock`
                : "Out of stock"}
            </Box>

            <Typography variant="h5" color="primary" sx={{ mt: 6 }}>
              Rs. {formatPrice(product.price)}
            </Typography>
          </div>
          {/* Quantity selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "1rem",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
              Quantity:
            </Typography>
            <IconButton
              onClick={() => handleQuantityChange("decrease")}
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            >
              <Remove />
            </IconButton>
            <TextField
              value={quantity}
              size="small"
              inputProps={{ min: 1, style: { textAlign: "center" } }}
              sx={{ width: 60 }}
              disabled
            />
            <IconButton
              onClick={() => handleQuantityChange("increase")}
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            >
              <Add />
            </IconButton>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "3rem",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "green",
                color: "white",
                height: "3rem",
              }}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
            </Button>
            <Button
              variant="outlined"
              sx={{ height: "3rem" }}
              disabled={product.stock <= 0}
            >
              BUY IT NOW
            </Button>
          </div>
        </div>
      </div>

      {/* Product Attributes/Specifications */}
      {hasAttributes && (
        <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Product Specifications
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ width: "55%" }}
          >
            <Table size="medium">
              <TableBody>
                {Object.entries(productAttributes).map(([key, value]) => {
                  // Skip internal or empty attributes
                  if (key.startsWith("_") || !value) return null;

                  // Format the attribute key for display
                  const formattedKey = key
                    .replace(/([A-Z])/g, " $1") // Add space before capital letters
                    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

                  return (
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                        {formattedKey}
                      </TableCell>
                      <TableCell>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value.toString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <Divider />

      {/* Description */}
      {product.description && (
        <div>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            {product.description}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default SingleProductPage;
