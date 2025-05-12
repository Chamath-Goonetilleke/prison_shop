import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import CategoryIcon from "@mui/icons-material/Category";
import LayersIcon from "@mui/icons-material/Layers";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import InventoryIcon from "@mui/icons-material/Inventory";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import BuildIcon from "@mui/icons-material/Build";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import CategoryManagement from "./category/CategoryManagement";
import ProductManagement from "./product/ProductManagement";
import OrderManagement from "./orders/OrderManagement";
import CustomOrderManagement from "./customOrders/CustomOrderManagement";
import SubCategoryManagement from "./category/SubCategoryManagement";
import SettingsManagement from "./settings/SettingsManagement";
import UserManagement from "./settings/UserManagement";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect } from "react";
import authService from "../services/authService";

const NAVIGATION = [
  {
    segment: "categories",
    title: "Category Management",
    icon: <CategoryIcon />,
    children: [
      {
        segment: "main-categories",
        title: "Main Categories",
        icon: <LayersIcon />,
      },
      {
        segment: "sub-categories",
        title: "Sub Categories",
        icon: <SubdirectoryArrowRightIcon />,
      },
    ],
  },

  {
    segment: "product-management",
    title: "Product Management",
    icon: <InventoryIcon />,
    children: [
      {
        segment: "products",
        title: "Products",
        icon: <ShoppingBagIcon />, // More fitting for a list of products/items
      },
    ],
  },

  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "custom-orders",
    title: "Custom Orders",
    icon: <BuildIcon />,
  },
  {
    segment: "users",
    title: "User Management",
    icon: <GroupIcon />,
  },
  {
    segment: "settings",
    title: "Settings",
    icon: <SettingsIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    primary: { main: "#24364d" },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: false },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        marginLeft: "1rem",
      }}
    >
      <Typography>{pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function AdminDashboard(props) {
  const router = useDemoRouter("/orders");

  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  const [session, setSession] = React.useState(null);

  const checkAdminRole = async () => {
    try {
      const adminData = await authService.checkAuth();
      setSession({
        user: {
          name: adminData.firstName + " " + adminData.lastName,
          email: adminData.email,
        },
      });
      setIsSuperAdmin(adminData.role === "super_admin");
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };

  useEffect(() => {
    checkAdminRole();
  }, []);

  const authentication = React.useMemo(() => {
    return {
      signOut: () => {
        authService.logout();
        window.location.reload();
        setSession(null);
      },
    };
  }, []);

  return (
    <AppProvider
      session={session}
      branding={{
        logo: <img src="/main-only-logo.png" alt="main-only-logo" />,
        title: "PRISON CRAFT",
      }}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout disableCollapsibleSidebar>
        {router.pathname === "/categories/main-categories" && (
          <CategoryManagement />
        )}
        {router.pathname === "/categories/sub-categories" && (
          <SubCategoryManagement />
        )}
        {router.pathname === "/product-management/products" && (
          <ProductManagement />
        )}
        {router.pathname === "/orders" && <OrderManagement />}
        {router.pathname === "/custom-orders" && <CustomOrderManagement />}
        {router.pathname === "/users" && <UserManagement />}
        {router.pathname === "/settings" && (
          <SettingsManagement isSuperAdmin={isSuperAdmin} />
        )}
      </DashboardLayout>
    </AppProvider>
  );
}

AdminDashboard.propTypes = {
  window: PropTypes.func,
};

export default AdminDashboard;
