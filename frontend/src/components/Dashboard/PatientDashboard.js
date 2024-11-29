// src/components/Dashboard/PatientDashboard.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments, getAvailableTimeSlots, bookAppointment } from '../../actions/appointmentActions';
import { getDoctors } from '../../actions/doctorActions';
import ViewAppointments from '../Appointments/ViewAppointments';

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { appointments, timeSlots, error } = useSelector((state) => state.appointments);
  const { doctors } = useSelector((state) => state.doctors);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Fetch doctors and appointments on mount
  useEffect(() => {
    dispatch(getAppointments());
    dispatch(getDoctors());
  }, [dispatch]);

  // Fetch time slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      dispatch(getAvailableTimeSlots(selectedDoctor, selectedDate));
    }
  }, [selectedDoctor, selectedDate, dispatch]);

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    setSelectedTimeSlot(null); // Reset time slot on doctor change
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot(null); // Reset time slot on date change
  };

  const handleTimeSlotSelect = (slot) => {
    if (slot.isAvailable) {
      setSelectedTimeSlot(slot);
    }
  };

  const handleBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      alert('Please select a doctor, date, and time slot before booking.');
      return;
    }
    dispatch(
      bookAppointment({
        doctorId: selectedDoctor,
        date: selectedTimeSlot.start,
      })
    );
  };

  return (
    <div className="container">
      <h1>Patient Dashboard</h1>

      {/* Doctor Selection */}
      <div>
        <label htmlFor="doctorSelect">Select Doctor:</label>
        <select
          id="doctorSelect"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div>
        <label htmlFor="dateSelect">Select Date:</label>
        <input
          id="dateSelect"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Available Time Slots */}
      {selectedDoctor && selectedDate && (
        <div>
          <h3>Available Time Slots</h3>
          {error && <p style={{ color: 'red' }}>{error.msg}</p>}
          {timeSlots.length > 0 ? (
            <ul>
              {timeSlots.map((slot, index) => (
                <li
                  key={index}
                  style={{
                    cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                    color: slot.isAvailable ? 'green' : 'red',
                  }}
                  onClick={() => handleTimeSlotSelect(slot)}
                >
                  {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {slot.isAvailable ? '' : ' (Booked)'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No time slots available for the selected date and doctor.</p>
          )}
        </div>
      )}

      {/* Selected Time Slot */}
      {selectedTimeSlot && (
        <div>
          <h4>Selected Time Slot:</h4>
          <p>
            {new Date(selectedTimeSlot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
            {new Date(selectedTimeSlot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}

      {/* Book Appointment */}
      <button onClick={handleBooking} disabled={!selectedTimeSlot}>
        Book Appointment
      </button>

      {/* View Appointments */}
      <ViewAppointments appointments={appointments} />
    </div>
  );
};

export default PatientDashboard;
