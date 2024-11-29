import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailableTimeSlots, bookAppointment } from '../../actions/appointmentActions';

const DoctorCalendar = ({ doctorId }) => {
  const dispatch = useDispatch();
  const { timeSlots = [], error } = useSelector((state) => state.appointments); // Default to empty array
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  useEffect(() => {
    if (doctorId && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      dispatch(getAvailableTimeSlots(doctorId, formattedDate));
    }
  }, [doctorId, selectedDate, dispatch]);

  const handleDateChange = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      alert('Please select a weekday (Monday to Friday).');
      return;
    }
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedEndTime(null);
  };

  const handleTimeSlotClick = (slot) => {
    if (slot.isAvailable) {
      setSelectedTime(new Date(slot.start));
      setSelectedEndTime(new Date(slot.end));
    }
  };

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a valid time slot.');
      return;
    }
    dispatch(bookAppointment({ doctorId, date: selectedTime }));
  };

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error.msg || 'Unable to load data'}</p>;
  }

  return (
    <div>
      <h2>Doctor's Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6} // Disable weekends
      />

      <div>
        <h3>Available Time Slots for {selectedDate.toDateString()}</h3>
        {timeSlots.length > 0 ? (
          <ul>
            {timeSlots.map((slot, index) => (
              <li
                key={index}
                style={{
                  cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                  color: slot.isAvailable ? 'green' : 'red',
                }}
                onClick={() => handleTimeSlotClick(slot)}
              >
                {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {slot.isAvailable ? '' : ' (Booked)'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No time slots available for this date.</p>
        )}
      </div>

      {selectedTime && (
        <div>
          <h4>Selected Slot:</h4>
          <p>
            {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
            {selectedEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}

      <button onClick={handleBooking} disabled={!selectedTime}>
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorCalendar;
