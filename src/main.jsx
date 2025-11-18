// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContex.jsx';
import ScrollToTop from 'react-scroll-to-top';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <ScrollToTop
        smooth
        color="white"
        style={{
          backgroundColor: '#3882F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    </ThemeProvider>
  </React.StrictMode>
);
