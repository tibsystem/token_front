import React from 'react';
import { Link } from '../router';

export default function Sidebar() {
  return (
    <div className="bg-light border-end vh-100" style={{width: '200px'}}>
      <ul className="nav flex-column p-2">
        <li className="nav-item"><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
        <li className="nav-item"><Link to="/imoveis" className="nav-link">Imóveis</Link></li>
        <li className="nav-item"><Link to="/p2p" className="nav-link">P2P</Link></li>
        <li className="nav-item"><Link to="/history" className="nav-link">Histórico</Link></li>
      </ul>
    </div>
  );
}
