// src/components/Dashboard/DoctorDashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '../../actions/appointmentActions';
import AddMedicalRecord from '../MedicalRecords/AddMedicalRecord';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  return (
    <div className="container">
      <h1>Doctor Dashboard</h1>
      <AddMedicalRecord />
      {/* Display appointments */}
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            {appointment.date} with {appointment.patientId.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;
