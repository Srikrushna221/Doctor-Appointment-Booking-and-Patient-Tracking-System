// src/components/Appointments/ViewAppointments.js
import React from 'react';

const ViewAppointments = ({ appointments }) => {
  return (
    <div>
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            {new Date(appointment.date).toLocaleString()} with{' '}
            {appointment.doctorId.name} - Status: {appointment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppointments;
