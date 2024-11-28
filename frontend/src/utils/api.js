// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust the baseURL as per your backend server
});

api.defaults.headers.post['Content-Type'] = 'application/json';

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (localStorage.token) {
      config.headers['authorization'] = localStorage.token;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default api;
