import React from 'react';
import { Link } from '../router';

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand mb-0 h1">TokenMarket</span>
      <Link to="/logout" className="text-white">Sair</Link>
    </nav>
  );
}
