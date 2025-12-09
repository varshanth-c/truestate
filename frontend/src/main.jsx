import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SalesPage from './pages/SalesPage';
import './index.css';

const qc = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={qc}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalesPage/>} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
