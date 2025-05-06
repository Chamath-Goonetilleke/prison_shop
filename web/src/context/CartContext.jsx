import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      // Get the available stock
      const availableStock = product.stock || 0;

      // Ensure quantity doesn't exceed stock
      const finalQuantity = Math.min(quantity, availableStock);

      // If no stock available, don't add to cart
      if (availableStock <= 0) {
        return prevItems;
      }

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        // Calculate new quantity, not exceeding available stock
        const newQuantity = Math.min(
          updatedItems[existingItemIndex].quantity + finalQuantity,
          availableStock
        );

        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
        };
        return updatedItems;
      } else {
        // Add new item to cart
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.nameEn,
            nameSi: product.nameSi,
            price: product.price,
            image: product.mainImage || "/bed.jpg",
            quantity: finalQuantity,
            maxStock: availableStock,
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // Ensure quantity doesn't go below 1 or exceed available stock
          const newQuantity = Math.max(
            1,
            Math.min(
              item.quantity + delta,
              item.maxStock || Number.MAX_SAFE_INTEGER
            )
          );
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Open/close cart drawer
  const toggleCart = () => {
    setCartOpen((prevState) => !prevState);
  };

  // Cart item count
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    cartOpen,
    toggleCart,
    setCartOpen,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
