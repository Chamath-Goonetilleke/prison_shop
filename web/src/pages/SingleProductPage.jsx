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
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Breadcrumb from "../components/common/BreadCrumb";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import { useCart } from "../context/CartContext";

const SingleProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const scrollContainerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { addToCart, setCartOpen } = useCart();

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

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setNotification({
        open: true,
        message: `${product.nameEn} added to cart successfully!`,
        severity: "success",
      });
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      setCartOpen(true);
    }
  };

  // Handle notification close
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
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
    ? selectedImage
    : product.mainImage
    ? product.mainImage
    : "/bed.jpg";

  // Prepare attributes list for display
  const productAttributes = product.attributes ? product.attributes : {};
  const hasAttributes = Object.keys(productAttributes).length > 0;

  return (
    <div
      style={{
        margin: isMobile ? "1rem" : isTablet ? "2rem" : "3rem",
      }}
    >
      <Breadcrumb
        category={category}
        subcategory={subcategory}
        product={product}
      />

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "10px" : "20px",
          padding: isMobile ? "10px" : "20px",
        }}
      >
        {/* Left side - Images */}
        <div
          style={{
            flex: isMobile ? "none" : 1.3,
            width: isMobile ? "100%" : "auto",
          }}
        >
          <img
            src={mainImageUrl}
            alt={product.nameEn}
            style={{
              width: "100%",
              borderRadius: "10px",
              maxHeight: isMobile ? "50vh" : "70vh",
            }}
          />

          {product.additionalImages && product.additionalImages.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: isMobile ? "100%" : "95vh",
                marginTop: "10px",
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
                <ArrowCircleLeftOutlinedIcon
                  fontSize={isMobile ? "medium" : "large"}
                />
              </button>

              {/* Scrollable Image Container */}
              <div
                ref={scrollContainerRef}
                style={{
                  display: "flex",
                  padding: isMobile ? "5px" : "10px",
                  overflowX: "hidden",
                  scrollBehavior: "smooth",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                  gap: isMobile ? "5px" : "10px",
                }}
              >
                {/* Main image thumbnail */}
                <img
                  src={product.mainImage}
                  alt={product.nameEn}
                  onClick={() => handleThumbnailClick(product.mainImage)}
                  style={{
                    minWidth: isMobile ? "80px" : "150px",
                    maxWidth: isMobile ? "80px" : "150px",
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
                    src={imagePath}
                    alt={`${product.nameEn} -${index + 1}`}
                    onClick={() => handleThumbnailClick(imagePath)}
                    style={{
                      minWidth: isMobile ? "80px" : "150px",
                      maxWidth: isMobile ? "80px" : "150px",
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
                <ArrowCircleRightOutlinedIcon
                  fontSize={isMobile ? "medium" : "large"}
                />
              </button>
            </div>
          )}
        </div>

        {/* Right side - Product details */}
        <div
          style={{
            flex: isMobile ? "none" : 1,
            display: "flex",
            flexDirection: "column",
            marginLeft: isMobile ? "0" : isTablet ? "1rem" : "2rem",
            marginTop: isMobile ? "1rem" : "0",
            gap: isMobile ? "15px" : "30px",
          }}
        >
          <div>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              {product.nameSi && product.nameEn
                ? `${product.nameSi} (${product.nameEn})`
                : product.nameSi? product.nameSi
                : product.nameEn && product.nameEn}
            </Typography>
            <Typography sx={{ py: "0.5rem" }}>
              <strong>Product Code: {product.productCode}</strong>
            </Typography>
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                label={product.status || "In Stock"}
                color={product.status === "Out of Stock" ? "error" : "success"}
                size={isMobile ? "small" : "medium"}
              />
              {product.stock > 0
                ? `${product.stock} units in stock`
                : "Out of stock"}
            </Box>

            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="primary"
              sx={{ mt: isMobile ? 3 : 6 }}
            >
              Rs. {formatPrice(product.price)}
            </Typography>
          </div>
          {/* Quantity selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "5px" : "10px",
              marginTop: isMobile ? "0" : "1rem",
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
              gap: isMobile ? "10px" : "20px",
              marginTop: isMobile ? "1rem" : "3rem",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "green",
                color: "white",
                height: isMobile ? "2.5rem" : "3rem",
              }}
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
            </Button>
            <Button
              variant="outlined"
              sx={{ height: isMobile ? "2.5rem" : "3rem" }}
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
            >
              BUY IT NOW
            </Button>
          </div>
        </div>
      </div>

      {/* Product Attributes/Specifications */}
      {hasAttributes && (
        <div
          style={{
            marginBottom: isMobile ? "1.5rem" : "2rem",
            marginTop: isMobile ? "1.5rem" : "2rem",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Product Specifications
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ width: isMobile ? "100%" : isTablet ? "75%" : "55%" }}
          >
            <Table size={isMobile ? "small" : "medium"}>
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
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          width: "40%",
                          padding: isMobile ? 1 : 2,
                        }}
                      >
                        {formattedKey}
                      </TableCell>
                      <TableCell sx={{ padding: isMobile ? 1 : 2 }}>
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
        <div style={{ margin: isMobile ? "1rem 0" : 0 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Description
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            {product.description}
          </Typography>
        </div>
      )}

      {/* Success notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SingleProductPage;
