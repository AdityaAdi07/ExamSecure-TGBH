import React, { useState } from 'react';

const StudentDashboard = () => {
  const [examPin, setExamPin] = useState('');
  const [handshakeStatus, setHandshakeStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!examPin.trim()) {
      setHandshakeStatus('Please enter a valid Exam PIN.');
      return;
    }

    setHandshakeStatus('Attempting handshake...');
    
    fetch("http://localhost:4567/handshake", { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        if (data.handshake === "ok") {
          setHandshakeStatus("✅ Handshake successful! Redirecting to exam selection...");
          
          setTimeout(() => {
            window.location.href = "mains.html";
          }, 1000);
        } else {
          setHandshakeStatus("❌ Handshake failed. Is the Python app running?");
        }
      })
      .catch((err) => {
        console.error("Handshake error:", err);
        setHandshakeStatus("❌ Could not reach Python app. Make sure it's running on port 4567.");
      });
  };

  return (
    <div className="container">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome, student! Enter your Exam PIN to begin.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Exam PIN"
              value={examPin}
              onChange={(e) => setExamPin(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn">Start Exam</button>
        </form>

        {handshakeStatus && (
          <div className={`status-message ${handshakeStatus.includes('❌') ? 'status-error' : 'status-success'}`}>
            {handshakeStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;