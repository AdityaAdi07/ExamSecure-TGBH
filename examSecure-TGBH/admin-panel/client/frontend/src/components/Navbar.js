import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { FaHome, FaList, FaCog, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <BootstrapNavbar bg="primary" expand="lg" className="navbar">
      <Container fluid>
        <BootstrapNavbar.Brand href="#home">
          <FaShieldAlt className="me-2" />
          ExamSecure Proctoring
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="#home" className="active">
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link href="#logs">
              <FaList /> Logs
            </Nav.Link>
            <Nav.Link href="#settings">
              <FaCog /> Settings
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;