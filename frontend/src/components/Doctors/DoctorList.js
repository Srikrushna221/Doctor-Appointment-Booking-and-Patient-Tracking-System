// src/components/Doctors/DoctorList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../../actions/doctorActions';
import { Link } from 'react-router-dom';

const DoctorList = () => {
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  return (
    <div>
      <h2>Doctors</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            <Link to={`/doctors/${doctor._id}`}>
              {doctor.name} - {doctor.specialization}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
