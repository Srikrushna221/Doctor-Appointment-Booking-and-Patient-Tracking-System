// components/Dashboard/DoctorDashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments, cancelAppointment } from '../../actions/appointmentActions';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const handleCancel = (appointmentId) => {
    dispatch(cancelAppointment(appointmentId));
  };

  const doctorAppointments = appointments.filter(
    (appointment) => appointment.status === 'Scheduled'
  );

  return (
    <div className="container">
      <h1>Doctor Dashboard</h1>
      <h2>Your Appointments</h2>
      <ul>
        {doctorAppointments.map((appointment) => (
          <li key={appointment._id}>
            {new Date(appointment.date).toLocaleString()} with{' '}
            {appointment.patientId.name}
            <button onClick={() => handleCancel(appointment._id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;
