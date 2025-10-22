import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import { setupAxiosInterceptors } from './modules/auth/services/axiosInterceptor';

// Setup axios interceptors for auto token refresh
setupAxiosInterceptors();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
