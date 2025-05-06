import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CartPage from "../../pages/CartPage";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "white",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchExpanded, setSearchExpanded] = React.useState(true);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSearchExpanded = () => {
    setSearchExpanded(!searchExpanded);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const menuId = "primary-search-account-menu";
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <img
          src="/Prison_Craft_logo.png"
          alt="logo"
          style={{
            width: 50,
            height: 50,
          }}
        />
        {/* <Typography
          fontFamily={"monospace"}
          fontWeight={"bold"}
          fontSize={"15px"}
          sx={{ my: 2 }}
        >
          CELLMADE
        </Typography> */}
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="About Us" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Contact" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight={"bold"}>
          Hotline Number: 0114 677177
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#24364d" }}>
        <Toolbar
          sx={{
            flexDirection: { xs: "column", md: "row" },
            py: { xs: 1, md: 0 },
          }}
        >
          {/* Mobile Toolbar */}
          {isMobile && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  to: "/",
                }}
                component={Link}
                to="/"
              >
                <img
                  src="/Prison_Craft_logo.png"
                  alt="logo"
                  style={{
                    marginLeft: "20px",
                    width: 60,
                    height: 60,
                  }}
                />
                {/* <Typography
                  fontFamily={"monospace"}
                  fontWeight={"bold"}
                  fontSize={"12px"}
                  sx={{ ml: 1 }}
                >
                  CELLMADE
                </Typography> */}
              </Box>

              <Box sx={{ display: "flex" }}>
                <CartPage />
              </Box>
            </Box>
          )}

          {isMobile && searchExpanded && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <Search>
                <TextField
                  sx={{
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                  size="small"
                  placeholder="Search..."
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Search>
            </Box>
          )}

          {/* Tablet and Desktop Toolbar */}
          {!isMobile && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "10px",
                }}
                component={Link}
                to="/"
              >
                <img
                  src="/Prison_Craft_logo.png"
                  alt="logo"
                  style={{
                    width: isTablet ? 50 : 80,
                    height: isTablet ? 50 : 80,
                  }}
                />
                {/* <Typography
                  fontFamily={"monospace"}
                  fontWeight={"bold"}
                  fontSize={isTablet ? "12px" : "15px"}
                  color="white"
                >
                  CELLMADE
                </Typography> */}
              </Box>

              <div style={{ display: "flex", width: isTablet ? "40%" : "60%" }}>
                <TextField
                  sx={{
                    margin: isTablet ? "1rem" : "1.5rem",
                    width: "60%",
                    marginLeft: isTablet ? "1rem" : "5rem",
                    marginRight: "0rem",
                    border: "1px solid white",
                    backgroundColor: "white",
                    borderRadius: "5px 0px 0px 5px",
                  }}
                  size="small"
                  placeholder="Search..."
                />
                <Button
                  variant="contained"
                  sx={{
                    margin: isTablet ? "1rem" : "1.5rem",
                    border: "1px solid white",
                    marginLeft: "0rem",
                  }}
                >
                  <SearchIcon sx={{ mx: isTablet ? "0.5rem" : "1rem" }} />
                </Button>
              </div>

              {!isTablet && (
                <Box>
                  <img
                    src="/logo.png"
                    alt="logo"
                    style={{
                      width: 80,
                      height: 100,
                      padding: "10px",
                      marginRight: "1rem",
                    }}
                  />
                </Box>
              )}

              <Box
                sx={{
                  display: isTablet ? "none" : "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={"bold"}>
                  Hotline Number
                </Typography>
                <Typography variant="h7" fontWeight={"bold"}>
                  0114 677177
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ display: "flex", alignItems: "center", gap:"1rem" }}>
                <CartPage />
                {user ? (
                  <>
                    <IconButton
                      color="inherit"
                      onClick={handleMenu}
                      aria-label="account menu"
                    >
                      <AccountCircleIcon fontSize="large" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          navigate("/profile");
                        }}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button color="inherit" component={Link} to="/login">
                      Login
                    </Button>
                    <Button color="inherit" component={Link} to="/register">
                      Register
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>

      {renderMobileMenu}
    </Box>
  );
}
