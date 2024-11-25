// src/components/Layout/Header.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions';
import { Link } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  const authLinks = (
    <>
      {user && user.role === 'Patient' && (
        <Link to="/patient/dashboard">Dashboard</Link>
      )}
      {user && user.role === 'Doctor' && (
        <Link to="/doctor/dashboard">Dashboard</Link>
      )}
      <a href="#!" onClick={onLogout}>
        Logout
      </a>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
    </>
  );

  return (
    <header>
      <h1>Doctor Appointment System</h1>
      <nav>{isAuthenticated ? authLinks : guestLinks}</nav>
    </header>
  );
};

export default Header;
