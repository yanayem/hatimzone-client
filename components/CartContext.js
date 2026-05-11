"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart actions
  const addToCart = (product, quantity = 1, variant = null) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );
      if (existing) {
        return prev.map((item) =>
          item._id === product._id && JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, variant }];
    });
  };

  const removeFromCart = (productId, variant = null) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item._id === productId && JSON.stringify(item.variant) === JSON.stringify(variant))
      )
    );
  };

  const updateQuantity = (productId, quantity, variant = null) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist actions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some((item) => item._id === productId);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
