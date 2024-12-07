const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Schedule tasks to be run on the server
cron.schedule('0 9 * * *', async () => {
  // Runs every day at 9:00 AM
  console.log('Running daily appointment reminders');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  try {
    const appointments = await Appointment.find({
      date: { $gte: tomorrow, $lt: dayAfterTomorrow },
      status: 'Scheduled',
    });

    for (const appointment of appointments) {
      const patient = await User.findById(appointment.patientId);
      if (patient) {
        sendAppointmentReminder(appointment, patient.email);
      }
    }
  } catch (err) {
    console.error('Error sending appointment reminders', err);
  }
});
