import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Calendar library
import 'react-calendar/dist/Calendar.css'; // Calendar styles
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorCalendar, bookAppointment } from '../../actions/appointmentActions';

const DoctorCalendar = ({ doctorId }) => {
  const dispatch = useDispatch();
  const { timeSlots, error } = useSelector((state) => state.appointments);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (doctorId && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      dispatch(getDoctorCalendar(doctorId, formattedDate));
    }
  }, [doctorId, selectedDate, dispatch]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when changing date
  };

  const handleTimeSlotClick = (slot) => {
    if (!slot.isBooked) {
      setSelectedTime(slot.start);
    }
  };

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a time slot before booking.');
      return;
    }
    dispatch(bookAppointment({ doctorId, date: selectedTime }));
  };

  return (
    <div>
      <h2>Doctor's Calendar</h2>
      {error && <p style={{ color: 'red' }}>{error.msg}</p>}

      {/* Calendar to select a date */}
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
      />

      {/* Available Time Slots */}
      <div>
        <h3>Available Time Slots for {selectedDate.toDateString()}</h3>
        {timeSlots.length > 0 ? (
          <ul>
            {timeSlots.map((slot, index) => (
              <li
                key={index}
                style={{
                  cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                  color: slot.isBooked ? 'red' : 'green',
                }}
                onClick={() => handleTimeSlotClick(slot)}
              >
                {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {slot.isBooked && ' (Booked)'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No time slots available for this date.</p>
        )}
      </div>

      {/* Booking Button */}
      <button
        onClick={handleBooking}
        disabled={!selectedTime}
      >
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorCalendar;
