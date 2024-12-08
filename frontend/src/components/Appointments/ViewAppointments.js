import React from 'react';
import { useDispatch } from 'react-redux';
import { cancelAppointment } from '../../actions/appointmentActions';
import './ViewAppointments.css'; // Import the CSS

const ViewAppointments = ({ appointments }) => {
  const dispatch = useDispatch();

  const handleCancel = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(appointmentId));
    }
  };

  return (
    <div className="view-appointments">
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            <div className="appointment-info">
              {new Date(appointment.date).toLocaleString()} with {appointment.doctorId.name}
            </div>
            <div className={`appointment-status ${appointment.status.toLowerCase()}`}>
              Status: {appointment.status}
            </div>
            {appointment.status === 'Scheduled' && (
              <button onClick={() => handleCancel(appointment._id)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppointments;
