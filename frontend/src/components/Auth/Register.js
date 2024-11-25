// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: 'Patient',
    name: '',
    email: '',
    password: '',
    password2: '',
    specialization: '',
  });

  const { role, name, email, password, password2, specialization } = formData;

  const onChange = (e) => {
    if (e.target.name === 'role' && e.target.value === 'Doctor') {
      setFormData({ ...formData, [e.target.name]: e.target.value, specialization: '' });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      // Handle password mismatch
    } else {
      dispatch(registerUser(formData, navigate));
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <select name="role" value={role} onChange={onChange}>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>

        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />

        {role === 'Doctor' && (
          <input
            type="text"
            placeholder="Specialization"
            name="specialization"
            value={specialization}
            onChange={onChange}
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          name="password2"
          value={password2}
          onChange={onChange}
          required
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
