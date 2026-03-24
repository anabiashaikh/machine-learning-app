import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SensorData from './pages/SensorData';
import AlertsHistory from './pages/AlertsHistory';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import useAlertPolling from './hooks/useAlertPolling';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Start polling for alerts globally when the user is authenticated
  useAlertPolling(isAuthenticated, 15000);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div className="flex h-screen bg-navy overflow-hidden text-white">
        {/* Sidebar */}
        <Sidebar onLogout={handleLogout} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
          {/* Top Navigation */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-navy to-navy-light pt-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sensors" element={<SensorData />} />
              <Route path="/alerts" element={<AlertsHistory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      </Router>
    </>
  );
}

export default App;