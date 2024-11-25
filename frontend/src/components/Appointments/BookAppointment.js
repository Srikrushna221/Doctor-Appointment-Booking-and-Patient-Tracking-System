// src/components/Appointments/BookAppointment.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bookAppointment } from '../../actions/appointmentActions';

const BookAppointment = ({ doctors }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
  });

  const { doctorId, date } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(bookAppointment(formData));
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={onSubmit}>
        <select name="doctorId" value={doctorId} onChange={onChange} required>
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="date"
          value={date}
          onChange={onChange}
          required
        />

        <input type="submit" value="Book Appointment" />
      </form>
    </div>
  );
};

export default BookAppointment;
