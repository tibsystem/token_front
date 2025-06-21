import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from './router';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Imoveis from './pages/Imoveis';
import P2P from './pages/P2P';
import History from './pages/History';

function Private({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

function Logout() {
  localStorage.removeItem('token');
  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/imoveis" element={<Private><Imoveis /></Private>} />
        <Route path="/p2p" element={<Private><P2P /></Private>} />
        <Route path="/history" element={<Private><History /></Private>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
