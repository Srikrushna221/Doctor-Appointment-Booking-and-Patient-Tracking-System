import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors, getDoctors } from '../actions/doctorActions';

const DoctorsPage = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error.msg}</p>;
  }

  return (
    <div className="container">
      <h1>Doctors Information</h1>
      {doctors.map((doctor) => (
        <div key={doctor._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h2>{doctor.name}</h2>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Description:</strong> {doctor.description || 'No description available'}</p>
        </div>
      ))}
    </div>
  );
};

export default DoctorsPage;
