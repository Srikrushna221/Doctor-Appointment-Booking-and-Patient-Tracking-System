// components/Dashboard/DoctorDashboard.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments, cancelAppointment } from '../../actions/appointmentActions';
import { saveMedicalRecord } from '../../actions/medicalRecordActions';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const [selectedPatient, setSelectedPatient] = useState(null); // Track the selected patient
  const [record, setRecord] = useState(''); // Track the medical record text

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const handleCancel = (appointmentId) => {
    dispatch(cancelAppointment(appointmentId));
  };

  const handleSaveRecord = () => {
    if (selectedPatient && record.trim()) {
      dispatch(
        saveMedicalRecord({
          patientId: selectedPatient.patientId._id,
          doctorId: selectedPatient.doctorId, // Assuming doctorId is in state or fetched
          record,
        })
      );
      setRecord(''); // Clear the text box after saving
    }
  };

  const doctorAppointments = appointments.filter(
    (appointment) => appointment.status === 'Scheduled'
  );

  return (
    <div className="container">
      <h1>Doctor Dashboard</h1>
      <h2>Your Appointments</h2>
      <ul>
        {doctorAppointments.map((appointment) => (
          <li key={appointment._id}>
            {new Date(appointment.date).toLocaleString()} with{' '}
            {appointment.patientId.name}
            <button onClick={() => handleCancel(appointment._id)}>Cancel</button>
            <button
              onClick={() => {
                setSelectedPatient(appointment);
                setRecord(''); // Reset the record text when selecting a new patient
              }}
            >
              Add Record
            </button>
          </li>
        ))}
      </ul>

      {/* Add Medical Record Section */}
      {selectedPatient && (
        <div>
          <h3>Add Record for {selectedPatient.patientId.name}</h3>
          <textarea
            value={record}
            onChange={(e) => setRecord(e.target.value)}
            placeholder="Enter medical record here"
            rows="4"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={handleSaveRecord}>Save Record</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
