import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import {
  useMediaQuery,
  useTheme,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
  });

  const imageUrl = product?.mainImage ? product.mainImage : "/bed.jpg";

  // Safely format the price
  const formatPrice = (price) => {
    // Check if price exists and is a number
    if (price && !isNaN(parseFloat(price))) {
      return parseFloat(price).toFixed(2);
    }
    return "0.00";
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent the card click event
    addToCart(product, 1);
    setNotification({
      open: true,
      message: `${product.nameEn} added to cart!`,
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <>
      <Card
        sx={{
          width: isMobile ? 150 : 200,
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 3,
          },
          position: "relative",
        }}
      >
        <CardActionArea onClick={handleCardClick}>
          <CardMedia
            component="img"
            height={isMobile ? 120 : 180}
            image={imageUrl}
            alt={product.nameEn}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
            }}
          />
          <CardContent sx={{ pt: 1, pb: "30px !important" }}>
            <Typography
              gutterBottom
              variant={isMobile ? "body2" : "subtitle1"}
              component="div"
              noWrap
              sx={{
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.nameSi ? `${product.nameSi}` : product.nameEn}
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              color="text.secondary"
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.nameEn}
            </Typography>
            <Typography
              variant={isMobile ? "body2" : "subtitle1"}
              color="primary"
              sx={{ mt: 1, fontWeight: "bold" }}
            >
              Rs. {formatPrice(product.price)}
            </Typography>
          </CardContent>
        </CardActionArea>

        {/* Add to Cart Button positioned at bottom right */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={handleAddToCart}
            sx={{
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            <AddShoppingCartIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
      </Card>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
