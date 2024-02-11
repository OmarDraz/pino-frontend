import axios from 'axios';

const Axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Request interceptor to attach the token
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;  
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to check token expiration
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is due to an expired token
    if (error.response.status === 401) {
      const token = localStorage.getItem('token');
      const decodedToken = parseJwt(token);

      // Check if the token has expired
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        // Token has expired, redirect to login
        // Clear tokens and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

// Function to parse JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default Axios;
