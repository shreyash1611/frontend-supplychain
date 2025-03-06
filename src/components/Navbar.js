import React from 'react';
import { Link } from 'react-router-dom';
import veritasLogo from '../styles/veritas.png';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        <img src={veritasLogo} alt="Veritas Logo" className="navbar-logo" />
        <h1 className="navbar-title">VeritasChain</h1>
      </Link>
    </nav>
  );
};

export default Navbar;