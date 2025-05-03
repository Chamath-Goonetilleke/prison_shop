import React from "react";
import {
  Badge,
  IconButton,
  Box,
  Typography,
  Button,
  Drawer,
  Stack,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeItem,
    subtotal,
    cartOpen,
    toggleCart,
    setCartOpen,
    itemCount,
  } = useCart();

  const handleCheckout = () => {
    setCartOpen(false); // Close the cart drawer
    navigate("/checkout"); // Navigate to checkout page
  };

  return (
    <>
      <IconButton
        onClick={toggleCart}
        size="large"
        aria-label="shopping cart"
        color="inherit"
      >
        <Badge badgeContent={itemCount} color="error">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "80vw", sm: 400, md: 450 },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "#f5f5f5",
            }}
          >
            <Typography variant="h6">
              YOUR BAG ({itemCount} item{itemCount !== 1 ? "s" : ""})
            </Typography>
            <IconButton onClick={() => setCartOpen(false)}>
              <CloseIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Box>

          {/* Cart Items */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
            }}
          >
            {cartItems.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  p: 3,
                  textAlign: "center",
                }}
              >
                <ShoppingCartIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add some products to your cart to see them here!
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {cartItems.map((item) => (
                  <Card key={item.id} variant="outlined">
                    <CardContent
                      sx={{
                        display: "flex",
                        gap: 2,
                        "&:last-child": { pb: 2 },
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {item.nameSi
                            ? `${item.nameSi} (${item.name})`
                            : item.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <RemoveIcon sx={{ width: 16, height: 16 }} />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <AddIcon sx={{ width: 16, height: 16 }} />
                          </IconButton>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => removeItem(item.id)}
                            sx={{ color: "error.main" }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          minWidth: "80px",
                          textAlign: "right",
                        }}
                      >
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>

          {/* Footer */}
          {cartItems.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "#f5f5f5",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  SUBTOTAL
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Rs. {subtotal.toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Taxes and shipping calculated at checkout
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setCartOpen(false)}
                >
                  CONTINUE SHOPPING
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCheckout}
                  sx={{
                    bgcolor: "success.main",
                    "&:hover": {
                      bgcolor: "success.dark",
                    },
                  }}
                >
                  CHECKOUT
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default CartPage;
