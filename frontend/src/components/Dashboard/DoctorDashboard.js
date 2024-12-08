import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments, cancelAppointment } from '../../actions/appointmentActions';
import { saveMedicalRecord } from '../../actions/medicalRecordActions';
import { logout } from '../../actions/authActions';
import { loadUser } from '../../actions/authActions';
import './DoctorDashboard.css'; // Importing styles

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const [selectedPatient, setSelectedPatient] = useState(null); // Track the selected patient
  const [record, setRecord] = useState(''); // Track the medical record text
  const { user } = useSelector((state) => state.auth);

  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    dispatch(getAppointments());
    dispatch(loadUser());
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

  const onLogout = () => {
    dispatch(logout());
  };

  // Group appointments by patient and find the most recent for each
  const recentAppointmentsByPatient = appointments
    .filter((appointment) => appointment.status === 'Scheduled')
    .reduce((acc, appointment) => {
      const patientId = appointment.patientId._id;
      if (
        !acc[patientId] ||
        new Date(appointment.date) > new Date(acc[patientId].date)
      ) {
        acc[patientId] = appointment; // Keep the most recent appointment
      }
      return acc;
    }, {});

  const recentAppointments = Object.values(recentAppointmentsByPatient);

  const toggleInfoModal = () => {
    setShowInfoModal((prev) => !prev); // Toggle modal visibility
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Doctor Dashboard</h1>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
        <button className="info-button" onClick={toggleInfoModal}>
          Show Your Information
        </button>
        <h2 className="dashboard-subtitle">Your Appointments</h2>
        <ul className="appointment-list">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="appointment-item">
              <span className="appointment-info">
                {new Date(appointment.date).toLocaleString()} with{' '}
                <strong>{appointment.patientId.name}</strong>
              </span>
              <div className="appointment-buttons">
                <button
                  className="cancel-button"
                  onClick={() => handleCancel(appointment._id)}
                >
                  Cancel
                </button>
                {recentAppointments.some(
                  (recent) => recent._id === appointment._id
                ) && (
                  <button
                    className="record-button"
                    onClick={() => {
                      setSelectedPatient(appointment);
                      setRecord(''); // Reset the record text when selecting a new patient
                    }}
                  >
                    Add/Update Record
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Add Medical Record Section */}
        {selectedPatient && (
          <div className="record-section">
            <h3 className="record-title">
              Add Record for {selectedPatient.patientId.name}
            </h3>
            <textarea
              value={record}
              onChange={(e) => setRecord(e.target.value)}
              placeholder="Enter medical record here"
              rows="4"
              className="record-textarea"
            />
            <button className="save-button" onClick={handleSaveRecord}>
              Save Record
            </button>
          </div>
        )}
      </div>

      {/* Doctor Info Modal */}
      {showInfoModal && (
        <div className="info-modal">
          <div className="modal-content">
            <span className="close" onClick={toggleInfoModal}>&times;</span>
            {user && (
              <div>
                <h3>Your Information</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Specialization:</strong> {user.specialization || 'N/A'}</p>
                <p><strong>Description:</strong> {user.description || 'No description available'}</p>
                <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
