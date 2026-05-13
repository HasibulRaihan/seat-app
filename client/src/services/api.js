import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Automatically add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const getPhishingSimulation = () => API.get('/simulation/phishing');
export const submitSimulation = (data) => API.post('/simulation/submit', data);
export const getMyResults = () => API.get('/simulation/results');
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');

export default API;