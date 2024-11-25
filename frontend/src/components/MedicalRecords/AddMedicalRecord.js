// src/components/MedicalRecords/AddMedicalRecord.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMedicalRecord } from '../../actions/medicalRecordActions';

const AddMedicalRecord = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    patientId: '',
    description: '',
    prescription: '',
  });

  const { patientId, description, prescription } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addMedicalRecord(formData));
  };

  return (
    <div>
      <h2>Add Medical Record</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Patient ID"
          name="patientId"
          value={patientId}
          onChange={onChange}
          required
        />

        <textarea
          placeholder="Description"
          name="description"
          value={description}
          onChange={onChange}
          required
        />

        <textarea
          placeholder="Prescription"
          name="prescription"
          value={prescription}
          onChange={onChange}
          required
        />

        <input type="submit" value="Add Record" />
      </form>
    </div>
  );
};

export default AddMedicalRecord;
