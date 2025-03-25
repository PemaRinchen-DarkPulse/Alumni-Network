import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand href="#home" className="font-weight-bold">AlumniConnect</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="mx-auto">
            <Nav.Link href="#home" active>Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#events">Events</Nav.Link>
            <Nav.Link href="#mentorship">Mentorship</Nav.Link>
            <Nav.Link href="#faq">FAQs</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div>
          <Button variant="outline-primary" className="mr-2">Log in</Button>
          <Button variant="primary">Sign up</Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
