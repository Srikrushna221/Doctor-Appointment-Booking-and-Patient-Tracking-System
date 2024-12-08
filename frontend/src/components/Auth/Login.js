import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Layout/Header';
import './Login.css'; // Importing styles

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [message, setMessage] = useState(null); // State for success/error messages
  const [messageType, setMessageType] = useState(null); // "success" or "error"

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password }, navigate));
      setIsLoggedIn(true); // Update login status
      setMessage("Login successful!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  return (
    <>
    <Header/>
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome to Doctor Appointment System and Patient Portal</h1>
        <p className="login-description">
          The easiest way to manage your healthcare.
        </p>
        <ul className="login-features">
          <li>✅ View easy-to-read patient statements</li>
          <li>✅ Meet your Doctor and book an appointment</li>
          <li>✅ Review your health information</li>
        </ul>
        {message && (
          <div className={`login-message ${messageType}`}>
            {message}
          </div>
        )}
        {!isLoggedIn ? (
          <form onSubmit={onSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="login-input"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="login-input"
            />

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        ) : (
          <div className="login-success-message">
            <h2>Welcome back!</h2>
            <p>You are now logged in. Redirecting...</p>
          </div>
        )}
        <div className="login-footer">
          <Link to="/register" className="provider-sign-in">
            New? Sign In Here
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
