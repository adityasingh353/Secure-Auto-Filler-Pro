import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup';
import '../styles/global.css';

// Apply saved theme
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
