// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }, navigate));
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />

        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
