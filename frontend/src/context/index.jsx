// src/context/index.js
export { AuthProvider, useAuth } from './AuthContext';
export { CartProvider, useCart } from './CartContext';
export { ProductProvider, useProducts } from './ProductContext';
export { RentalProvider, useRentals } from './RentalContext';

// Combined Provider for easier usage
import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { RentalProvider } from './RentalContext';

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <RentalProvider>
            {children}
          </RentalProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default AppProvider;