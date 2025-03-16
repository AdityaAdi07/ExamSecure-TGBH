import React, { useState } from 'react';
import { Button, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { FaBan, FaUnlock, FaExclamationTriangle, FaUserSlash, FaInfoCircle, FaCheckCircle, FaBell, FaLaptop, FaDesktop } from 'react-icons/fa';

const ActionPanel = ({ 
  selectedUser, 
  onBanUser, 
  onUnbanUser, 
  onSendWarning 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  // Handle ban action
  const handleBan = async () => {
    setIsLoading(true);
    setActionMessage('');
    try {
      await onBanUser();
      setActionMessage('User banned successfully. Action "BAN" sent to database.');
      setMessageType('success');
    } catch (error) {
      setActionMessage('Error banning user: ' + (error.message || 'Unknown error'));
      setMessageType('danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unban action
  const handleUnban = async () => {
    setIsLoading(true);
    setActionMessage('');
    try {
      await onUnbanUser();
      setActionMessage('User unbanned successfully. Action message cleared from database.');
      setMessageType('success');
    } catch (error) {
      setActionMessage('Error unbanning user: ' + (error.message || 'Unknown error'));
      setMessageType('danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle warning action
  const handleWarning = async () => {
    setIsLoading(true);
    setActionMessage('');
    try {
      await onSendWarning();
      setActionMessage('Warning sent successfully. Action "YOU HAVE BEEN FLAGGED" sent to database.');
      setMessageType('success');
    } catch (error) {
      setActionMessage('Error sending warning: ' + (error.message || 'Unknown error'));
      setMessageType('danger');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="text-center p-4">
        <FaInfoCircle className="text-primary mb-3" style={{ fontSize: '2.5rem', opacity: 0.7 }} />
        <h6 className="text-muted">Select a user to perform actions</h6>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-center">
        <h5 className="mb-2 d-flex align-items-center justify-content-center">
          <FaUserSlash className="me-2 text-primary" />
          Selected User: <span className="fw-bold ms-2">{selectedUser.name}</span>
        </h5>
        
        <Badge 
          bg={
            selectedUser.status.toLowerCase() === 'normal' ? 'success' :
            selectedUser.status.toLowerCase() === 'warning' ? 'warning' :
            'danger'
          }
          className="px-3 py-2"
          style={{ fontSize: '0.85rem' }}
        >
          Current Status: {selectedUser.status}
        </Badge>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Processing action...</p>
        </div>
      ) : (
        <>
          {selectedUser.status === 'Ban' ? (
            <Button 
              variant="success" 
              className="action-btn"
              onClick={handleUnban}
              disabled={isLoading}
            >
              <FaUnlock /> Unban User
            </Button>
          ) : (
            <Button 
              variant="danger" 
              className="action-btn"
              onClick={handleBan}
              disabled={isLoading}
            >
              <FaBan /> Ban User
            </Button>
          )}
          
          <Button 
            variant="warning" 
            className="action-btn"
            onClick={handleWarning}
            disabled={isLoading}
          >
            <FaExclamationTriangle /> Send Warning
          </Button>
        </>
      )}
      
      {actionMessage && (
        <Alert variant={messageType} className="mt-3 small">
          {messageType === 'success' ? <FaCheckCircle className="me-2" /> : <FaInfoCircle className="me-2" />}
          {actionMessage}
        </Alert>
      )}
      
      {selectedUser.appsOpened && selectedUser.appsOpened.length > 0 && (
        <Card className="mt-4 border-0 bg-light">
          <Card.Body className="p-3">
            <h6 className="mb-3 d-flex align-items-center">
              <FaDesktop className="me-2 text-primary" />
              Apps Opened ({selectedUser.appsOpened.length})
            </h6>
            <div className="d-flex align-items-center">
              <Badge bg="primary" className="me-2 px-3 py-2">
                Latest: {selectedUser.latestApp}
              </Badge>
              {selectedUser.appsOpened.length > 1 && (
                <span className="text-muted small">
                  +{selectedUser.appsOpened.length - 1} more
                </span>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ActionPanel;