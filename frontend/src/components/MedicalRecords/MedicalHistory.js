// src/components/MedicalRecords/MedicalHistory.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMedicalHistory } from '../../actions/medicalRecordActions';

const MedicalHistory = ({ patientId }) => {
  const dispatch = useDispatch();
  const { medicalHistory } = useSelector((state) => state.medicalRecords);

  useEffect(() => {
    dispatch(getMedicalHistory(patientId));
  }, [dispatch, patientId]);

  return (
    <div>
      <h2>Medical History</h2>
      {medicalHistory && medicalHistory.records.length > 0 ? (
        <ul>
          {medicalHistory.records.map((record, index) => (
            <li key={index}>
              {new Date(record.date).toLocaleDateString()} - {record.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No medical records found.</p>
      )}
    </div>
  );
};

export default MedicalHistory;
