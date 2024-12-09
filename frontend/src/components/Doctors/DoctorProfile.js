import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctor } from '../../actions/doctorActions';
import axios from 'axios';

const DoctorProfile = ({ match }) => {
  const dispatch = useDispatch();
  const { doctor } = useSelector((state) => state.doctors);

  const [rating, setRating] = useState(0); // Average rating
  const [totalRatings, setTotalRatings] = useState(0); // Total number of ratings
  const [userRating, setUserRating] = useState(0); // User-provided rating

  useEffect(() => {
    // Fetch doctor details
    dispatch(getDoctor(match.params.id));

    // Fetch average rating for the doctor
    const fetchRating = async () => {
      try {
        const response = await axios.get(`/doctors/${match.params.id}/rating`);
        setRating(response.data.averageRating);
        setTotalRatings(response.data.totalRatings);
      } catch (err) {
        console.error('Error fetching doctor rating:', err);
      }
    };

    fetchRating();
  }, [dispatch, match.params.id]);

  const submitRating = async () => {
    try {
      await axios.post(
        `/api/doctors/${match.params.id}/rate`,
        { doctorId: match.params.id, rating: userRating },
        {
          headers: {
            Authorization: localStorage.getItem('token'),, // Assuming JWT for auth
          },
        }
      );
      alert('Rating submitted successfully!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating');
    }
  };

  if (!doctor) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{doctor.name}</h1>
      <p>Specialization: {doctor.specialization}</p>

      {/* Display average rating and total reviews */}
      <p>Average Rating: {rating.toFixed(1)} ({totalRatings} reviews)</p>

      {/* Form to submit a rating */}
      <h3>Rate this Doctor</h3>
      <input
        type="number"
        min="1"
        max="5"
        value={userRating}
        onChange={(e) => setUserRating(Number(e.target.value))}
        placeholder="Rate 1-5"
      />
      <button onClick={submitRating}>Submit Rating</button>
    </div>
  );
};

export default DoctorProfile;
