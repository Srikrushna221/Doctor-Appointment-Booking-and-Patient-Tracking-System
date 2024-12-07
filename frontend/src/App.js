// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadUser } from './actions/authActions';
import { useDispatch } from 'react-redux';
import setAuthToken from './utils/setAuthToken';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import PrivateRoute from './components/Common/PrivateRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import DoctorsPage from './components/DoctorsPage';


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route exact path="/doctors" component={DoctorsPage} />

        {/* Protected Routes */}
        <Route
          path="/patient/dashboard/*"
          element={<PrivateRoute component={PatientDashboard} />}
        />
        <Route
          path="/doctor/dashboard/*"
          element={<PrivateRoute component={DoctorDashboard} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
