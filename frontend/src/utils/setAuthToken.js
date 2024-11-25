// src/utils/setAuthToken.js
import api from './api';

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['authorization'] = token;
  } else {
    delete api.defaults.headers.common['authorization'];
  }
};

export default setAuthToken;
