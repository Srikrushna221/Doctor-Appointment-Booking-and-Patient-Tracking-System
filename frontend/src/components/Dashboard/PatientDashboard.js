// src/components/Dashboard/PatientDashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '../../actions/appointmentActions';
import { getDoctors } from '../../actions/doctorActions';
import BookAppointment from '../Appointments/BookAppointment';
import ViewAppointments from '../Appointments/ViewAppointments';

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const { doctors } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(getAppointments());
    dispatch(getDoctors());
  }, [dispatch]);

  return (
    <div className="container">
      <h1>Patient Dashboard</h1>
      <BookAppointment doctors={doctors} />
      <ViewAppointments appointments={appointments} />
    </div>
  );
};

export default PatientDashboard;
