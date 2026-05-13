import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Admin from './pages/Admin';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/simulation" element={token ? <Simulation /> : <Navigate to="/" />} />
        <Route path="/admin" element={token ? <Admin /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;