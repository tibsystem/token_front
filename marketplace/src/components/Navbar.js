import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Token Market</span>
        <button onClick={logout} className="btn btn-outline-danger">Sair</button>
      </div>
    </nav>
  );
}

export default Navbar;
