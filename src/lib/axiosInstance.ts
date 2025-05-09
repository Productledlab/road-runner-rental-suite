import axios from 'axios';

// Create an instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally show toast, redirect, or log out user
    // if (error.response?.status === 401) {
    //   // Handle unauthorized access globally
    //   console.error('Unauthorized - redirecting to login');
    //   localStorage.removeItem('token');
    //   window.location.href = '/';
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
