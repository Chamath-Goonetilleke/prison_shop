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
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const CartPage = () => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([
    {
      id: 1,
      name: "GOLDEN PEARS",
      quantity: 1,
      price: 340.0,
      image: "/bed.jpg",
    },
    {
      id: 2,
      name: "VEGETABLE BUDGET PACK",
      quantity: 1,
      price: 1574.0,
      image: "/bed.jpg",
    },
  ]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const updateQuantity = (id, delta) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>

      <IconButton
        onClick={toggleDrawer}
        size="large"
        aria-label="show 4 new mails"
        color="inherit"
      >
        <Badge badgeContent={items.length} color="error">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: { xs: "40vh", sm: 500 },
            "& .MuiPaper-root": {
              width: { xs: "40vh", sm: 500 },
            },
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
            }}
          >
            <Typography variant="h6">
              YOUR BAG ({items.length} item(s))
            </Typography>
            <IconButton onClick={toggleDrawer}>
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
            <Stack spacing={2}>
              {items.map((item) => (
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
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {item.name}
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
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1">SUB TOTAL</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Rs. {subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Taxes and shipping calculated at the checkout
            </Typography>
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth>
                GO TO CART
              </Button>
              <Button
                variant="contained"
                fullWidth
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
        </Box>
      </Drawer>
    </>
  );
};

export default CartPage;
