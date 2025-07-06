import axios from 'axios';

// Axios for user server
const axiosUser = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_SERVER_URL || 'http://localhost:5000/api/v1',
});

// Axios for sandbox server
const axiosSandbox = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SANDBOX_SERVER_URL || 'http://localhost:3000/api/v1',
});

// Add token from localStorage (client-side only)
if (typeof window !== 'undefined') {
  axiosUser.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export { axiosUser, axiosSandbox };
