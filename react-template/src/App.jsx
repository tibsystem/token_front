import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import Register from './Register';

export default function App() {
  const [page, setPage] = useState('login');

  if (page === 'login') {
    return <AdminLogin onLogin={() => setPage('home')} onNavigateRegister={() => setPage('register')} />;
  }

  if (page === 'register') {
    return <Register onRegister={() => setPage('home')} onNavigateLogin={() => setPage('login')} />;
  }

  return (
    <div className="container my-5">
      <h1 className="mb-3">SmartAdmin React Environment</h1>
      <p className="lead">Bem-vindo, administrador!</p>
    </div>
  );
}
