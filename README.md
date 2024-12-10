## **README**: Doctor Appointment Booking and Patient Tracking System

### **Overview:**
This repository contains the Doctor Appointment Booking and Patient Tracking System, a full-stack MERN application comprising a frontend and a backend. The Doctor Appointment Booking and Patient Tracker System is a modern healthcare management solution designed to streamline the appointment scheduling process and improve the overall patient experience. By integrating various functionalities into a unified digital platform, the system addresses inefficiencies in traditional appointment management while offering features that benefit patients, doctors, and healthcare administrators alike. This guide will help you set up the application on Windows and macOS, including installation and running instructions.

---

### **General Requirements:**
* Node.js (for frontend development)
* npm (package manager for Node.js)
* Git (for cloning the repository)
* MongoDB (for database)

---

### **Installation Instructions -**

**Step 1:** Clone the Repository
* Use Git to clone the repository to your local machine: `git clone <repository-url>`
* Run `cd Doctor-Appointment-Booking-and-Patient-Tracking-System`

**Step 2:** Install MongoDB (Database)

**On macOS:**
1. Follow the official documentation to install and run the MongoDB server locally on macOS - https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
2. After starting the mongodb server, run `mongosh` command to generate the MONGO_URI which is in the format of mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2
3. Add `/doctor-appointment` at the end of the URL (To create a new database named `doctor-appointment`) and update this URL in the backend on db.js file in the config folder 

**On Windows:**
1. Follow the official documentation to install and run the MongoDB server locally in windows : - https://www.mongodb.com/try/download/community](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/ 
2. cd to C:\Program Files\MongoDB\Server\<version_num>\bin
3. Enter command `mongod`
4. by default, mongodb server will start at port 27017
5. Change the URL in the backend on db.js file.
mongodb://localhost:27017/doctor-appointment

**Step 3: Setting Up the Frontend**
1.	Navigate to the frontend directory : `cd frontend`
2.	Install dependencies : `npm install`
3.	If you have any vulnerabilities try to run `npm audit fix` or `npm audit fix --force`
4.	Start the server : `npm run start`

**Step 4: Setting Up the Backend**
1.	Navigate to the backend directory : `cd backend`
2.	Install dependencies : `npm install`
3.	If you have any vulnerabilities try to run `npm audit fix` or `npm audit fix --force`
4.	Start the server : `npm start`
5.	If you notice port conflicts in macOS, use the command `kill -9 <PID>` to kill the process running on the port then restart the server again using the command npm start. In windows use `taskkill`.

The React application can be accessed directly using the specified port number by navigating to: localhost:<port_number>. By default it is http://localhost:3000/

---

### **Steps to run test cases using Jest -**
1. Go to the `test` folder in the `backend`
2. Run `npm jest <test_file_name>`

---

### **Video Demo-**
https://drive.google.com/file/d/19QGukKLnDlzEeimom0ueYbVVvH9HHeCn/view?usp=sharing

---

Assumptions made for the project -

1. Patient can reschedule appointment by cancelling and booking a new appointment.
2. Doctor can see and cancel the appointments, but he is assumed to be available for the working hours. So only if an appointment is already booked for the timeslot it is blocked.
3. Only for the latest appointment for a Patient, a Doctor can Add/Update the Medical Record, and only the updated Record from that Doctor is shown for the Patient.





