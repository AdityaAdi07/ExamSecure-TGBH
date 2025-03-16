// components/RiskLogsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RiskLogsTable = () => {
  const [riskLogs, setRiskLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskLogs = async () => {
      try {
        const response = await axios.get('/api/risk-logs');
        setRiskLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch risk logs');
        setLoading(false);
        console.error(err);
      }
    };

    fetchRiskLogs();
  }, []);

  if (loading) return <div>Loading risk data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="risk-logs-container">
      <h2>Student Risk Logs</h2>
      <table className="risk-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Exam Type</th>
            <th>App Risk</th>
            <th>Final Risk</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {riskLogs.map(log => (
            <tr key={log._id} className={log.finalRisk > 70 ? 'high-risk' : log.finalRisk > 40 ? 'medium-risk' : 'low-risk'}>
              <td>{log.username}</td>
              <td>{log.examType}</td>
              <td>{log.appRisk}%</td>
              <td>{log.finalRisk.toFixed(2)}%</td>
              <td>
                <button onClick={() => window.location.href = `/details/${log._id}`}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskLogsTable;