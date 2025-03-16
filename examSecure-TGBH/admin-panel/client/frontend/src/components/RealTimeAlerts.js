import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { FaExclamationCircle, FaExclamationTriangle, FaBan, FaLock, FaInfoCircle } from 'react-icons/fa';

const RealTimeAlerts = ({ alertUsers = [] }) => {
  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get icon based on status
  const getAlertIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'ban':
        return <FaBan className="alert-icon alert-danger" />;
      case 'os lockdown':
        return <FaLock className="alert-icon alert-danger" />;
      case 'warning':
        return <FaExclamationTriangle className="alert-icon alert-warning" />;
      default:
        return <FaExclamationCircle className="alert-icon alert-warning" />;
    }
  };

  // Get alert message based on status
  const getAlertMessage = (user) => {
    switch (user.status.toLowerCase()) {
      case 'ban':
        return `${user.name}: User Banned`;
      case 'os lockdown':
        return `${user.name}: OS Lockdown Triggered`;
      case 'warning':
        return `${user.name}: Suspicious Activity`;
      default:
        return `${user.name}: Status Changed`;
    }
  };

  // Get severity class for the alert
  const getAlertClass = (status) => {
    switch (status.toLowerCase()) {
      case 'ban':
      case 'os lockdown':
        return 'border-start border-danger border-4';
      case 'warning':
        return 'border-start border-warning border-4';
      default:
        return 'border-start border-info border-4';
    }
  };

  // If no alerts, show a message
  if (!alertUsers || alertUsers.length === 0) {
    return (
      <div className="text-center p-3">
        <FaInfoCircle className="text-primary mb-2" style={{ fontSize: '2rem' }} />
        <p className="text-muted mb-0">No active alerts at this time</p>
      </div>
    );
  }

  // Otherwise, show the alerts
  return (
    <ListGroup variant="flush">
      {alertUsers.map((user) => (
        <ListGroup.Item 
          key={user._id}
          className={`d-flex justify-content-between align-items-center ${getAlertClass(user.status)}`}
        >
          <div>
            {getAlertIcon(user.status)}
            <span className="fw-medium">{getAlertMessage(user)}</span>
          </div>
          <Badge 
            bg={user.status.toLowerCase() === 'warning' ? 'warning' : 'danger'}
            text={user.status.toLowerCase() === 'warning' ? 'dark' : 'white'}
            pill
          >
            {user.status}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RealTimeAlerts;