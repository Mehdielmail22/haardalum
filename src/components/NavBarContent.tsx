import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Badge, NavDropdown, InputGroup, Button } from 'react-bootstrap'; // Add InputGroup, Button and remove Button
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Import NavLink
import { BsCartFill } from 'react-icons/bs';
import { FaUserCircle, FaSearch } from 'react-icons/fa'; // Import FaSearch
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useAuth } from '../context/AuthContext'; // Import useAuth
import logo from '../assets/logo.png'; // Import the logo

interface NavBarContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const NavBarContent: React.FC<NavBarContentProps> = ({ searchTerm, setSearchTerm }) => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Initialize useTranslation and get i18n instance
  const [expanded, setExpanded] = useState(false); // State to control Navbar expansion
  const { user, logout } = useAuth(); // Use user and logout from AuthContext

  const handleSearchSubmit = () => {
    // e.preventDefault(); // No need for event object here anymore
    navigate(`/products?search=${searchTerm}`); // Navigate to products page with search term
    setExpanded(false); // Close navbar on search submit
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setExpanded(false); // Close navbar on language change
  };

  const handleNavLinkClick = () => {
    setExpanded(false); // Close navbar on Nav.Link click
  };

  const handleLogout = () => {
    logout();
    setExpanded(false); // Close navbar on logout
    navigate('/'); // Redirect to home after logout
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="HardAlum Logo"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="mx-auto position-relative" style={{ maxWidth: '350px' }}> {/* Removed onSubmit */}
            <InputGroup className="search-input-group" style={{ width: '350px' }}> {/* Added custom class */}
              <FormControl
                type="text" // Changed from "search" to "text"
                placeholder={t("Search products...")}
                className="rounded-pill ps-4 pe-5"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }} // Prevent search on Enter key press
                style={{ paddingRight: '3.5rem', WebkitAppearance: 'none', MozAppearance: 'none' }} // Keep padding for icon, remove native clear button
                autoComplete="off"
              />
              <Button variant="outline-secondary" onClick={handleSearchSubmit} className="border-0 bg-transparent text-muted position-absolute end-0 top-50 translate-middle-y" style={{ zIndex: 10 }}>
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
          <Nav>
            <Nav.Link as={NavLink} to="/" end onClick={handleNavLinkClick}>{t("Home")}</Nav.Link>
            <Nav.Link as={NavLink} to="/products" onClick={handleNavLinkClick}>{t("Products")}</Nav.Link>
            <Nav.Link as={NavLink} to="/contact" onClick={handleNavLinkClick}>{t("Contact")}</Nav.Link>
            <Nav.Link as={NavLink} to="/cart" className="d-flex align-items-center cart-link" onClick={handleNavLinkClick}>
              <BsCartFill className="me-1" /> {t("Cart")}
              {cart.length > 0 && (
                <Badge pill bg="light" className="ms-1"> {/* Changed bg="info" to bg="light" */}
                  {cart.length}
                </Badge>
              )}
            </Nav.Link>
            {user ? (
              <> 
                <NavDropdown title={<><FaUserCircle className="me-1" /> {user.username}</>} id="basic-nav-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile" onClick={handleNavLinkClick}>{t("My Profile")}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders" onClick={handleNavLinkClick}>{t("My Orders")}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>{t("Logout")}</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <NavDropdown title={<><FaUserCircle className="me-1" /> {t("Account")}</>} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/login" onClick={handleNavLinkClick}>{t("Login")}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/signup" onClick={handleNavLinkClick}>{t("Sign Up")}</NavDropdown.Item>
              </NavDropdown>
            )}
            <NavDropdown title={i18n.language.toUpperCase()} id="language-switcher-dropdown" align="end">
              <NavDropdown.Item onClick={() => changeLanguage('en')}>{t("English")}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('fr')}>{t("French")}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('ar')}>{t("Arabic")}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarContent;
