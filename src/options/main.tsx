import React from 'react';
import ReactDOM from 'react-dom/client';
import Options from './Options';
import '../styles/global.css';

const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
