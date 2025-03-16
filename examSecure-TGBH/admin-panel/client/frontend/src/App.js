import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState([]);
  const [alertUsers, setAlertUsers] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({
    labels: ['Low', 'Medium', 'High'],
    data: [0, 0, 0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch user data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUserData(response.data.users);
      setRiskDistribution(response.data.riskDistribution);
      setAlertUsers(response.data.alertUsers || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
    
    // Set up refresh interval (every 30 seconds)
    const interval = setInterval(fetchData, 30000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Handle ban user
  const handleBanUser = async () => {
    if (!selectedUser) return;
    
    try {
      await axios.post('/api/users/ban', { userId: selectedUser._id });
      await fetchData(); // Refresh data
      return true;
    } catch (err) {
      console.error('Error banning user:', err);
      setError('Failed to ban user. Please try again.');
      throw err;
    }
  };

  // Handle unban user
  const handleUnbanUser = async () => {
    if (!selectedUser) return;
    
    try {
      await axios.post('/api/users/unban', { userId: selectedUser._id });
      await fetchData(); // Refresh data
      return true;
    } catch (err) {
      console.error('Error unbanning user:', err);
      setError('Failed to unban user. Please try again.');
      throw err;
    }
  };

  // Handle send warning
  const handleSendWarning = async () => {
    if (!selectedUser) return;
    
    try {
      await axios.post('/api/users/warn', { userId: selectedUser._id });
      await fetchData(); // Refresh data
      return true;
    } catch (err) {
      console.error('Error sending warning:', err);
      setError('Failed to send warning. Please try again.');
      throw err;
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    if (!query) {
      fetchData();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/search/${query}`);
      setUserData(response.data.users || response.data);
      if (response.data.alertUsers) {
        setAlertUsers(response.data.alertUsers);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error searching:', err);
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <Dashboard 
        userData={userData}
        riskDistribution={riskDistribution}
        loading={loading}
        error={error}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onSendWarning={handleSendWarning}
        onSearch={handleSearch}
        onRefresh={fetchData}
        alertUsers={alertUsers}
      />
    </div>
  );
}

export default App;