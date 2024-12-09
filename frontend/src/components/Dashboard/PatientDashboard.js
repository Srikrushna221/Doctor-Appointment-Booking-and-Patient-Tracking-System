import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // Import axios to make the API call
import { getAppointments, getAvailableTimeSlots, bookAppointment } from '../../actions/appointmentActions';
import { getDoctors } from '../../actions/doctorActions';
import { fetchMedicalRecords } from '../../actions/medicalRecordActions';
import { logout } from '../../actions/authActions'; // Assuming you have a logout action
import ViewAppointments from '../Appointments/ViewAppointments';
import { loadUser } from '../../actions/authActions';
import './PatientDashboard.css'; // Include CSS for animations and scrolling

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { appointments, timeSlots, error } = useSelector((state) => state.appointments);
  const { doctors, loading: doctorsLoading, error: doctorsError } = useSelector((state) => state.doctors);
  const { records } = useSelector((state) => state.medicalRecords);
  const { user } = useSelector((state) => state.auth);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDoctorsInfo, setShowDoctorsInfo] = useState(false);

  // State for logged-in patient's data
  const [showPatientInfoModal, setShowPatientInfoModal] = useState(false);

  // Rating-related states
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedDoctorForRating, setSelectedDoctorForRating] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [doctorRatings, setDoctorRatings] = useState({}); // Store average rating and total reviews for each doctor

  useEffect(() => {
    dispatch(getAppointments());
    dispatch(getDoctors());
    dispatch(fetchMedicalRecords());
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const appointmentDate = new Date(year, month - 1, day || 0);

      dispatch(getAvailableTimeSlots(selectedDoctor, appointmentDate));
    }
  }, [selectedDoctor, selectedDate, dispatch]);

  useEffect(() => {
    // Fetch ratings for all doctors
    const fetchRatings = async () => {
      try {
        const ratings = {};
        for (const doctor of doctors) {
          const response = await axios.get(`/api/doctors/${doctor._id}/rating`);
          ratings[doctor._id] = response.data;
        }
        setDoctorRatings(ratings);
      } catch (err) {
        console.error('Error fetching doctor ratings:', err);
      }
    };

    if (doctors.length > 0) {
      fetchRatings();
    }
  }, [doctors]);

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    setSelectedTimeSlot(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot(null);
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
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours, minutes, seconds] = new Date(selectedTimeSlot.start).toTimeString().split(':').map(Number);
    const appointmentDate = new Date(year, month - 1, day, hours, minutes, seconds || 0);

    dispatch(
      bookAppointment({
        doctorId: selectedDoctor,
        date: appointmentDate.toISOString(),
      })
    );
  };

  const handleRateDoctor = (doctorId) => {
    setSelectedDoctorForRating(doctorId);
    setRatingModalOpen(true);
  };
  
  //previous impl 0
  /*const submitRating = async () => {
    if (!userRating || userRating < 1 || userRating > 5) {
      alert('Please provide a valid rating between 1 and 5.');
      return;
    }

    try {
      await axios.post(
        `/api/doctors/${selectedDoctorForRating}/rate`,
        { doctorId: selectedDoctorForRating, rating: userRating },
        {
          headers: {
            Authorization: localStorage.getItem('token'), // Assuming JWT for auth
          },
        }
      );
      alert('Rating submitted successfully!');
      setRatingModalOpen(false);
      setUserRating(0);
      // Refresh ratings after submission
      const response = await axios.get(`/api/doctors/${selectedDoctorForRating}/rating`);
      setDoctorRatings((prev) => ({
        ...prev,
        [selectedDoctorForRating]: response.data,
      }));
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating');
    }
  };*/

  // previous impl 1
  /*const submitRating = async () => {
    if (!userRating || userRating < 1 || userRating > 5) {
      alert('Please provide a valid rating between 1 and 5.');
      return;
    }
  
    try {
      // Submit the rating
      const response = await axios.post(
        `/api/doctors/${selectedDoctorForRating}/rate`,
        { rating: userRating },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
  
      alert(response.data.msg);
  
      // Fetch updated ratings for the specific doctor
      const updatedRatings = await axios.get(
        `/api/doctors/${selectedDoctorForRating}/rating`
      );
      setDoctorRatings((prev) => ({
        ...prev,
        [selectedDoctorForRating]: updatedRatings.data,
      }));
  
      setRatingModalOpen(false);
      setUserRating(0);
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating');
    }
  };*/
  
  const submitRating = async () => {
    if (!userRating || userRating < 1 || userRating > 5) {
      alert('Please provide a valid rating between 1 and 5.');
      return;
    }
  
    try {
      // Submit the rating
      const response = await axios.post(
        `/api/doctors/${selectedDoctorForRating}/rate`,
        { rating: userRating },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
  
      alert(response.data.msg);
  
      // Fetch updated ratings for the specific doctor
      const updatedRatings = await axios.get(
        `/api/doctors/${selectedDoctorForRating}/rating`
      );
      setDoctorRatings((prev) => ({
        ...prev,
        [selectedDoctorForRating]: updatedRatings.data,
      }));
  
      setRatingModalOpen(false);
      setUserRating(0);
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating');
    }
  };  

  const onLogout = () => {
    dispatch(logout());
  };

  const togglePatientInfoModal = () => {
    setShowPatientInfoModal((prev) => !prev); // Toggle modal visibility
  };

  return (
    <div className="patient-dashboard">
      <aside className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>

         {/* Button to show patient information modal */}
         <button className="patient-info-button" onClick={togglePatientInfoModal}>
          Show Your Information
        </button>
      </aside>

      <main className="dashboard-content">
        {/* Doctors Information */}
        <div>
          <button
            onClick={() => setShowDoctorsInfo((prevState) => !prevState)}
            className="toggle-button"
          >
            {showDoctorsInfo ? 'Hide Doctors Information' : 'Show Doctors Information'}
          </button>

          <div
            className={`doctors-info-container ${showDoctorsInfo ? 'open' : 'closed'}`}
          >
            {doctorsLoading && <p>Loading doctors...</p>}
            {doctorsError && <p style={{ color: 'red' }}>{doctorsError.msg}</p>}
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                  <h2>{doctor.name}</h2>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Description:</strong> {doctor.description || 'No description available'}</p>
                  <p>
                    <strong>Average Rating:</strong>{' '}
                    {doctorRatings[doctor._id]?.averageRating?.toFixed(1) || 'N/A'} (
                    {doctorRatings[doctor._id]?.totalRatings || 0} reviews)
                  </p>
                  <button onClick={() => handleRateDoctor(doctor._id)}>
                    Rate Doctor
                  </button>
                </div>
              ))
            ) : (
              <p>No doctors available at the moment.</p>
            )}
          </div>
        </div>

         {/* Doctor and Date Selection */}
         <div className="selection-container">
          <label htmlFor="doctorSelect">Select Doctor:</label>
          <select id="doctorSelect" value={selectedDoctor} onChange={handleDoctorChange}>
            <option value="">-- Select Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>

          <label htmlFor="dateSelect">Select Date:</label>
          <input id="dateSelect" type="date" value={selectedDate} onChange={handleDateChange} />
        </div>

        {/* Available Time Slots */}
        {error && <p style={{ color: 'red' }}>{error.msg}</p>}
        <div className="time-slots-container">
          {selectedDoctor && selectedDate && (
            <div>
              <h3>Available Time Slots</h3>
              {timeSlots.length > 0 ? (
                <ul className="time-slots-list">
                  {timeSlots.map((slot, index) => (
                    <li
                      key={index}
                      className={`time-slot ${slot.isAvailable ? 'available' : 'booked'}`}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {new Date(slot.start).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}-{' '}
                      {new Date(slot.end).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No time slots available for the selected date and doctor.</p>
              )}
            </div>
          )}
        </div>

        {/* Selected Time Slot */}
        {selectedTimeSlot && (
          <div className="selected-time-slot">
            <h4>Selected Time Slot:</h4>
            <p>
              {new Date(selectedTimeSlot.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}-{' '}
              {new Date(selectedTimeSlot.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}

        {/* Book Appointment */}
        <button
          onClick={handleBooking}
          className="book-appointment-button"
          disabled={!selectedTimeSlot}
        >
          Book Appointment
        </button>

        {/* View Appointments */}
        <ViewAppointments appointments={appointments} />

         {/* View Medical Records */}
         <div>
          <h3>Your Medical Record</h3>
          {records.length > 0 ? (
            <ul className="medical-records-list">
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
      </main>

       {/* Patient Info Modal */}
      {showPatientInfoModal && (
        <div className="patient-info-modal">
          <div className="modal-content">
            <span className="close" onClick={togglePatientInfoModal}>&times;</span>
            {user && (
              <div>
                <h3>Your Information</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Rating Modal */}
        {ratingModalOpen && (
        <div className="rating-modal">
          <div className="modal-content">
          <h3>Rate the Doctor</h3>
          <input 
              type="number" 
              min="1"
              max="5"
              value={userRating}
              onChange={(e) => setUserRating(Number(e.target.value))}
          />
          <button onClick={submitRating}>Submit Rating</button>
          <button onClick={() => setRatingModalOpen(false)}>Close</button>
          </div>
        </div>
        )}
      </div>
  );
};

export default PatientDashboard;
