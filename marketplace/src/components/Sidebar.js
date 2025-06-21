import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3" style={{ width: 200, minHeight: '100vh' }}>
      <h4 className="mb-4">Menu</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link text-white">Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/imoveis" className="nav-link text-white">Imóveis</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/p2p" className="nav-link text-white">P2P</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
