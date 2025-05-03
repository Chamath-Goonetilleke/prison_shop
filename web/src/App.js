import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NavBar from "./components/common/NavBar";
import SingleProductPage from "./pages/SingleProductPage";
import Footer from "./components/common/Footer";
import { CartProvider } from "./context/CartContext";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <CartProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product/:productId" element={<SingleProductPage />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}

export default App;
