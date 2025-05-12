import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NavBar from "./components/common/NavBar";
import SingleProductPage from "./pages/SingleProductPage";
import Footer from "./components/common/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CustomOrderPage from "./pages/CustomOrderPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import PrisonProductsPage from "./pages/PrisonProductsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:productId" element={<SingleProductPage />} />
          <Route
            path="/category/:categoryId"
            element={<CategoryProductsPage />}
          />
          <Route path="/prison/:prisonId" element={<PrisonProductsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-orders"
            element={
              <ProtectedRoute>
                <CustomOrderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
