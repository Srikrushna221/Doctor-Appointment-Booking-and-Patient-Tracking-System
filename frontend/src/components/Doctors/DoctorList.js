import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../../actions/doctorActions';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios to fetch ratings

const DoctorList = () => {
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctors);

  const [doctorRatings, setDoctorRatings] = useState({}); // To store ratings for doctors

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    // Fetch ratings for each doctor
    const fetchRatings = async () => {
      const ratings = {};
      for (const doctor of doctors) {
        try {
          const response = await axios.get(`/api/doctors/${doctor._id}/rating`);
          ratings[doctor._id] = response.data;
        } catch (err) {
          console.error(`Error fetching rating for doctor ${doctor._id}:`, err);
        }
      }
      setDoctorRatings(ratings);
    };

    if (doctors.length > 0) {
      fetchRatings();
    }
  }, [doctors]);

  const handleRateDoctor = async (doctorId) => {
    const rating = prompt('Please enter your rating for this doctor (1-5):');
    if (rating && rating >= 1 && rating <= 5) {
      try {
        await axios.post(
          `/api/doctors/${doctorId}/rate`,
          { doctorId, rating: Number(rating) },
          {
            headers: {
              Authorization: localStorage.getItem('token'),, // Assuming JWT for auth
            },
          }
        );
        alert('Rating submitted successfully!');
        // Refresh ratings after submission
        const response = await axios.get(`/api/doctors/${doctorId}/rating`);
        setDoctorRatings((prevRatings) => ({
          ...prevRatings,
          [doctorId]: response.data,
        }));
      } catch (err) {
        console.error(`Error submitting rating for doctor ${doctorId}:`, err);
        alert('Failed to submit rating. Please try again.');
      }
    } else {
      alert('Invalid rating. Please enter a number between 1 and 5.');
    }
  };

  return (
    <div>
      <h2>Doctors</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            <Link to={`/api/doctors/${doctor._id}`}>
              {doctor.name} - {doctor.specialization}
            </Link>
            <p>
              <strong>Average Rating:</strong>{' '}
              {doctorRatings[doctor._id]?.averageRating?.toFixed(1) || 'N/A'} (
              {doctorRatings[doctor._id]?.totalRatings || 0} reviews)
            </p>
            <button onClick={() => handleRateDoctor(doctor._id)}>Rate Doctor</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
