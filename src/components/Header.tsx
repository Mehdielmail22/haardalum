import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaSearch, FaBars, FaMapMarkerAlt, FaTruck, FaUser, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../style.css'; 

const Header: React.FC = () => {
  const { cart } = useCart();
  const { t, i18n } = useTranslation();

  const totalCartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?query=${searchTerm}`);
      setSearchTerm('');
      setIsMobileSearchBarOpen(false); // Close mobile search bar after search
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileSearchBar = () => {
    setIsMobileSearchBarOpen(!isMobileSearchBarOpen);
  };

  return (
    <header className="header">
      <div className="super-top-header">
        <div className="super-top-header-left">
          {/* <FaMobileAlt />
          <span>Commandez Sur L'application Et Obtenez Une Réduction Supplémentaire !</span> */}
        </div>
        <div className="super-top-header-right">
          <div className="super-top-header-item">
            <FaMapMarkerAlt />
            <Link to="/stores" className="text-decoration-none text-light">{t("Stores")}</Link>
          </div>
          <div className="super-top-header-item">
            <FaTruck />
            <Link to="/orders" className="text-decoration-none text-light">{t("Track Order")}</Link>
          </div>
          <div className="super-top-header-item">
            <FaUser />
            <Link to="/profile" className="text-decoration-none text-light">{t("My Account")}</Link>
          </div>
          <div className="super-top-header-item language-switcher">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="language-select"
            >
              <option value="fr">Fr</option>
              <option value="ar">Ar</option>
              <option value="en">En</option>
            </select>
          </div>
        </div>
      </div>
      <div className="top-header">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="Bousfiha Logo" />
          </Link>
        </div>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t("Search products...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch /> {t("Search")}
          </button>
        </form>
        <div className="header-icons">
          <div className="mobile-search-icon" onClick={toggleMobileSearchBar}>
            <FaSearch />
          </div>
          <div className="profile-icon-mobile">
            <Link to="/profile">
              <FaUser />
            </Link>
          </div>
          <div className="cart-icon">
            <Link to="/cart">
              <FaShoppingCart />
              <span className="cart-count">{totalCartQuantity}</span>
            </Link>
          </div>
        </div>
      </div>
      <div className={`mobile-menu-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-sidebar" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <ul className="sidebar-nav-links">
          {/* Main navigation links */}
          <li><Link to="/">{t("Home")}</Link></li>
          <li><Link to="/products">{t("Products")}</Link></li>
          <li><Link to="/contact">{t("Contact")}</Link></li>
          <li><Link to="/cart">{t("Cart")}</Link></li>
          <li><Link to="/orders">{t("My Orders")}</Link></li>
        </ul>
        {/* Mobile Language Switcher */}
        <div className="sidebar-language-switcher">
          <h4>{t("Language")}</h4>
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-select-mobile"
          >
            <option value="fr">Fr</option>
            <option value="ar">Ar</option>
            <option value="en">En</option>
          </select>
        </div>
      </div>

      <div className={`mobile-search-bar-overlay ${isMobileSearchBarOpen ? 'open' : ''}`}>
        <div className="search-overlay-header">
          <h3>{t("Search")}</h3>
          <button className="close-search-overlay" onClick={toggleMobileSearchBar}>
            <FaTimes />
          </button>
        </div>
        <form className="search-overlay-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t("Search products...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>
      <nav className="bottom-header">
        <div className="menu-toggle" onClick={toggleMobileMenu}>
          <FaBars />
        </div>
        <ul className="nav-links-desktop">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>{t("Home")}</NavLink></li>
          <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>{t("Products")}</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>{t("Contact")}</NavLink></li>
          <li><NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""}>{t("Cart")}</NavLink></li>
          <li><NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>{t("My Orders")}</NavLink></li>
        </ul>
        <div className="contact-info">
          <span>N° ECO 0801 02 17 00</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
