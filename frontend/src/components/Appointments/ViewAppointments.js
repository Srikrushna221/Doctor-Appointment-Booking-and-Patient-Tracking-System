import React from 'react';
import { useDispatch } from 'react-redux';
import { cancelAppointment } from '../../actions/appointmentActions';

const ViewAppointments = ({ appointments }) => {
  const dispatch = useDispatch();

  const handleCancel = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(appointmentId));
    }
  };

  return (
    <div>
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            {new Date(appointment.date).toLocaleString()} with {appointment.doctorId.name}
            {' - '}
            Status: {appointment.status}
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
