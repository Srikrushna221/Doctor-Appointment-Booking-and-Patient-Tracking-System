import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments, getAvailableTimeSlots, bookAppointment } from '../../actions/appointmentActions';
import { getDoctors } from '../../actions/doctorActions';
import { fetchMedicalRecords } from '../../actions/medicalRecordActions';
import ViewAppointments from '../Appointments/ViewAppointments';

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { appointments, timeSlots, error } = useSelector((state) => state.appointments);
  const { doctors, loading: doctorsLoading, error: doctorsError } = useSelector((state) => state.doctors);
  const { records } = useSelector((state) => state.medicalRecords);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDoctorsInfo, setShowDoctorsInfo] = useState(false); // Toggle visibility of Doctors Information

  // Fetch doctors, appointments, and medical records on mount
  useEffect(() => {
    dispatch(getAppointments());
    dispatch(getDoctors());
    dispatch(fetchMedicalRecords());
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

      {/* Doctors Information Toggle */}
      <div>
        <button
          onClick={() => setShowDoctorsInfo((prevState) => !prevState)}
          style={{ marginBottom: '10px' }}
        >
          {showDoctorsInfo ? 'Hide Doctors Information' : 'Show Doctors Information'}
        </button>

        {showDoctorsInfo && (
          <div>
            <h3>Doctors Information</h3>
            {doctorsLoading && <p>Loading doctors...</p>}
            {doctorsError && <p style={{ color: 'red' }}>{doctorsError.msg}</p>}
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div key={doctor._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                  <h2>{doctor.name}</h2>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Description:</strong> {doctor.description || 'No description available'}</p>
                </div>
              ))
            ) : (
              <p>No doctors available at the moment.</p>
            )}
          </div>
        )}
      </div>


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

      {/* View Medical Records */}
      <div>
        <h3>Your Medical Records</h3>
        {records.length > 0 ? (
          <ul>
            {records.map((record) => (
              <li key={record._id}>
                <p>{record.record}</p>
                <small>Added by Dr. {record.doctorId.name}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No medical records available.</p>
        )}
      </div>

    </div>
  );
};

export default PatientDashboard;
