import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002', // Changed to match backend port
  withCredentials: true,
});

export default api; 