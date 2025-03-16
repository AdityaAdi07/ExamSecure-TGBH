import React from 'react';
import { Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaExclamationTriangle, FaLock, FaBan, FaCheck } from 'react-icons/fa';

const UserTable = ({ 
  userData, 
  loading, 
  error, 
  selectedUser,
  onUserSelect 
}) => {
  // Helper function to determine status badge
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return <Badge bg="success"><FaCheck className="me-1" /> Normal</Badge>;
      case 'warning':
        return <Badge bg="warning" text="dark"><FaExclamationTriangle className="me-1" /> Warning</Badge>;
      case 'os lockdown':
        return <Badge bg="danger"><FaLock className="me-1" /> OS Lockdown</Badge>;
      case 'ban':
        return <Badge bg="danger"><FaBan className="me-1" /> Banned</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2 text-muted">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FaExclamationTriangle className="me-2" />
        {error}
      </Alert>
    );
  }

  if (!userData || userData.length === 0) {
    return (
      <Alert variant="info">
        No users found. Try adjusting your search criteria.
      </Alert>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Risk Score</th>
            <th>Keyboard Risk</th>
            <th>Mouse Risk</th>
            <th>Status</th>
            <th>Last Event</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr 
              key={user._id}
              className={`user-row ${selectedUser && selectedUser._id === user._id ? 'selected' : ''}`}
              onClick={() => onUserSelect(user)}
            >
              <td className="fw-bold">{user.name}</td>
              <td>
                <span 
                  className={`badge ${user.riskScore >= 80 ? 'bg-danger' : user.riskScore >= 50 ? 'bg-warning text-dark' : 'bg-success'}`}
                  style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}
                >
                  {user.riskScore}%
                </span>
              </td>
              <td>{user.keyboardRisk}%</td>
              <td>{user.mouseRisk}%</td>
              <td>{getStatusBadge(user.status)}</td>
              <td>{user.appsOpened?.length > 0 ? user.appsOpened[user.appsOpened.length - 1] : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;

