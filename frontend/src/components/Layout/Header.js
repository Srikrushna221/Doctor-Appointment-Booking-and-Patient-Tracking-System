// src/components/Layout/Header.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions';
import { Link } from 'react-router-dom';
import './Header.css';  // Make sure CSS is imported

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  const authLinks = (
    <>
      {user && user.role === 'Patient' && (
        <Link to="/patient/dashboard" className="nav-link">Dashboard</Link>
      )}
      {user && user.role === 'Doctor' && (
        <Link to="/doctor/dashboard" className="nav-link">Dashboard</Link>
      )}
      <a href="#!" onClick={onLogout} className="nav-link logout-link">Logout</a>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
    </>
  );

  return (
    <header className="header-container">
      <h1 className="header-title">Doctor Appointment System</h1>
      <nav className="header-nav">
        {isAuthenticated ? authLinks : guestLinks}
      </nav>
    </header>
  );
};

export default Header;
