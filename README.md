**README**: Doctor Appointment Booking and Patient Tracking System

**Overview:**
This repository contains the Doctor Appointment Booking and Patient Tracking System, a full-stack application comprising a frontend and a backend. This guide will help you set up the application on Windows and macOS, including installation and running instructions.
Prerequisites
Ensure you have the following tools installed:

**General Requirements:**
●	Node.js (for frontend development)
●	npm (package manager for Node.js)
●	Git (for cloning the repository)
●	MongoDB (as the database)

**Installation Instructions**
Step 1: Clone the Repository
Use Git to clone the repository to your local machine:
git clone <repository-url> 
cd Doctor-Appointment-Booking-and-Patient-Tracking-System
Step 2: Install MongoDB (Database)

**On macOS:**
1.	Change the URL in the backend on db.js file.
mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2/doctor-appointment
2.	Add the MongoDB Homebrew Tap:
brew tap mongodb/brew
3.	Install and start the MongoDB service:
brew services start mongodb/brew/mongodb-community
4.	Open the MongoDB shell:
Mongosh
5.	Verify MongoDB is running by typing mongod --dbpath db in the shell.

**On Windows:**
1.	Install MongoDB from : https://www.mongodb.com/try/download/community
2.	Start the services.
3.	Change the URL in the backend on db.js file.
mongodb://localhost:27017/doctor-appointment

**Step 3: Setting Up the Frontend**
1.	Navigate to the frontend directory : cd frontend
2.	Install dependencies : npm install
3.	Start the server : npm start

**Step 4: Setting Up the Backend**
1.	Navigate to the backend directory : cd backend
2.	Install dependencies : npm install
3.	Start the server : npm start
4.	If we notice port conflicts using the command kill -9 <PID> we can kill the process running on the same port then restart the server again using the command npm start.

The React application can also be accessed directly using the specified port number by navigating to: localhost:<port_number>.





