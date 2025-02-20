import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavigationBar = ({ token, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Port de Plaisance</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && (
              <>
                <Nav.Link as={Link} to="/dashboard">Tableau de Bord</Nav.Link>
                <Nav.Link as={Link} to="/reservations">Réservations</Nav.Link>
              </>
            )}
          </Nav>
          {token ? (
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
          ) : (
            <Button variant="outline-light" onClick={() => navigate("/login")}>Connexion</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
