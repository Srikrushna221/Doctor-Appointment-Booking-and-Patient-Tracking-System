// src/components/Doctors/DoctorProfile.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctor } from '../../actions/doctorActions';

const DoctorProfile = ({ match }) => {
  const dispatch = useDispatch();
  const { doctor } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(getDoctor(match.params.id));
  }, [dispatch, match.params.id]);

  if (!doctor) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{doctor.name}</h1>
      <p>Specialization: {doctor.specialization}</p>
      {/* Display ratings and other profile details */}
    </div>
  );
};

export default DoctorProfile;
