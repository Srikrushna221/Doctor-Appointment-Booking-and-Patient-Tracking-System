// Register.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errorMessage, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    role: 'Patient', // default role
    name: '',
    email: '',
    password: '',
    password2: '',
    specialization: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const { role, name, email, password, password2, specialization, description } = formData;

  const onChange = (e) => {
  if (e.target.name === 'role' && e.target.value === 'Doctor') {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      specialization: '',
      description: '', // Clear description when role is set to Doctor
    });
  } else {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
};


  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = 'Name is required';
    if (!email) formErrors.email = 'Email is required';
    if (!password) formErrors.password = 'Password is required';
    if (password !== password2) formErrors.password2 = 'Passwords do not match';
    if (role === 'Doctor' && !specialization) formErrors.specialization = 'Specialization is required';
    if (role === 'Doctor' && !description) formErrors.description = 'Description is required';

    return formErrors;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      dispatch(registerUser(formData, navigate));
      setErrors({}); // Clear any existing errors
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <>
    <Header/>
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Create an Account</h1>

        {/* Show Success Message */}
        {successMessage && (
          <div
            style={{
              color: 'green',
              backgroundColor: '#e8f9e8',
              border: '1px solid #4CAF50',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              textAlign: 'center',
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Show Error Message */}
        {errorMessage && (
          <div
            style={{
              color: 'red',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={onSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="form-input"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
            {errors.role && <small className="error-message">{errors.role}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={name}
              onChange={onChange}
              className="form-input"
            />
            {errors.name && <small className="error-message">{errors.name}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-input"
            />
            {errors.email && <small className="error-message">{errors.email}</small>}
          </div>

          {role === 'Doctor' && (
            <>
              <div className="form-group">
                <label htmlFor="specialization">Specialization</label>
                <input
                  type="text"
                  placeholder="Enter your specialization"
                  name="specialization"
                  value={specialization}
                  onChange={onChange}
                  className="form-input"
                />
                {errors.specialization && <small className="error-message">{errors.specialization}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  placeholder="Enter your description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  className="form-input"
                />
                {errors.description && <small className="error-message">{errors.description}</small>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={onChange}
              className="form-input"
            />
            {errors.password && <small className="error-message">{errors.password}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              name="password2"
              value={password2}
              onChange={onChange}
              className="form-input"
            />
            {errors.password2 && <small className="error-message">{errors.password2}</small>}
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
