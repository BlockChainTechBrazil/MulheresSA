import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import ClientDashboard from '../pages/ClientDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/client-dashboard" element={<ClientDashboard />} />
    </Routes>
  );
}
