// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import store from './store';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { RentalProvider } from './context/RentalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <RentalProvider>
              <BrowserRouter>
                <App />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </BrowserRouter>
            </RentalProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);