import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser    = (data) => API.post('/auth/register', data);
export const loginUser       = (data) => API.post('/auth/login', data);
export const getMe           = ()     => API.get('/auth/me');

export const getSimIntro     = ()     => API.get('/simulation/phishing/intro');
export const getQuestion     = (id)   => API.get(`/simulation/phishing/${id}`);
export const submitQuestion  = (id, data) => API.post(`/simulation/phishing/${id}/submit`, data);
export const completeSimulation = (data) => API.post('/simulation/phishing/complete', data);
export const getMyResults    = ()     => API.get('/simulation/results');
export const getLeaderboard  = ()     => API.get('/simulation/leaderboard');

export const getAdminStats   = ()     => API.get('/admin/stats');
export const getAllUsers      = ()     => API.get('/admin/users');

export default API;