import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bookAppointment, getAvailableTimeSlots } from '../../actions/appointmentActions';

const BookAppointment = ({ doctors }) => {
  const dispatch = useDispatch();
  const { availableTimeSlots, error } = useSelector((state) => state.appointments);

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '', // New field for time
  });

  const { doctorId, date, time } = formData;

  useEffect(() => {
    if (doctorId && date) {
      dispatch(getAvailableTimeSlots(doctorId, date));
    }
  }, [dispatch, doctorId, date]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!time) {
      alert('Please select a time for the appointment.');
      return;
    }
    const currentDate = new Date();
    const appointmentDateTime = new Date(`${date}T${time}`);
    console.log(appointmentDateTime)
    if (appointmentDateTime <= currentDate) {
      alert('You cannot book an appointment in the past. Please select a future time.');
      return;
    }

    dispatch(bookAppointment({ doctorId, date: appointmentDateTime }));
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      {error && <p style={{ color: 'red' }}>{error.msg}</p>}
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
          type="date"
          name="date"
          value={date}
          onChange={onChange}
          min={new Date().toISOString().split('T')[0]} // Prevent past dates
          required
        />

        <input
          type="time"
          name="time"
          value={time}
          onChange={onChange}
          required
        />

        <input type="submit" value="Book Appointment" />
      </form>
    </div>
  );
};

export default BookAppointment;