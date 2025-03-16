import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaSync, FaSearch, FaUserShield, FaChartBar, FaBell, FaClipboardList } from 'react-icons/fa';
import UserTable from './UserTable';
import RiskDistribution from './RiskDistribution';
import RealTimeAlerts from './RealTimeAlerts';
import ActionPanel from './ActionPanel';

const Dashboard = ({
  userData,
  riskDistribution,
  loading,
  error,
  selectedUser,
  onUserSelect,
  onBanUser,
  onUnbanUser,
  onSendWarning,
  onSearch,
  onRefresh,
  alertUsers = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <Container fluid className="dashboard">
      <h1 className="dashboard-title">
        <FaUserShield className="me-2" />
        Exam Monitoring Dashboard
      </h1>
      <Row>
        <Col xs={12}>
          <div className="d-flex mb-3">
            <Form className="d-flex flex-grow-1" onSubmit={handleSearch}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search users"
                />
                <Button variant="outline-primary" type="submit">Search</Button>
              </InputGroup>
            </Form>
            <Button 
              variant="primary" 
              className="refresh-btn ms-2"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh data"
            >
              <FaSync className={loading ? 'fa-spin' : ''} />
              <span> Refresh</span>
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <FaClipboardList className="me-2" />
              Active Users
            </Card.Header>
            <Card.Body>
              <UserTable 
                userData={userData} 
                loading={loading} 
                error={error}
                selectedUser={selectedUser}
                onUserSelect={onUserSelect}
              />
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <FaChartBar className="me-2" />
              Risk Score Distribution
            </Card.Header>
            <Card.Body>
              <RiskDistribution distribution={riskDistribution} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <FaBell className="me-2" />
              Real-time Alerts
              {alertUsers.length > 0 && (
                <span className="badge bg-danger float-end rounded-pill">
                  {alertUsers.length}
                </span>
              )}
            </Card.Header>
            <Card.Body>
              <RealTimeAlerts alertUsers={alertUsers} />
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <FaUserShield className="me-2" />
              Actions
            </Card.Header>
            <Card.Body>
              <ActionPanel 
                selectedUser={selectedUser}
                onBanUser={onBanUser}
                onUnbanUser={onUnbanUser}
                onSendWarning={onSendWarning}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;