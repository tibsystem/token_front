import React, { useState } from 'react';
import AdminLogin from './AdminLogin';

export default function App() {
  const [isLogged, setIsLogged] = useState(false);

  if (!isLogged) {
    return <AdminLogin onLogin={() => setIsLogged(true)} />;
  }

  return (
    <div className="container my-5">
      <h1 className="mb-3">SmartAdmin React Environment</h1>
      <p className="lead">Bem-vindo, administrador!</p>
    </div>
  );
}
