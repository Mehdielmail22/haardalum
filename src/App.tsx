import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import aluminumAccessories from "./assets/aluminum-accessories.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'; // Import Navigate
import './style.css'
import ProductDetailsPage from './components/ProductDetailsPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import ContactPage from './components/ContactPage';
import ProductsPage from './components/ProductsPage';
import SignupPage from './components/SignupPage'; // Import SignupPage
import LoginPage from './components/LoginPage'; // Import LoginPage
import ProfilePage from './components/ProfilePage'; // Import ProfilePage
import OrderHistoryPage from './components/OrderHistoryPage'; // Import OrderHistoryPage
import { CartProvider, useCart } from './context/CartContext'; // Import useCart
import Header from './components/Header';
import i18n from './i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { products as staticProducts, type Product } from './data/products'; // Import products and Product interface
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import NoDataFound from './components/NoDataFound'; // Import NoDataFound
import { FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa'; // Import new icons

interface DimensionOption {
  id: number;
  dimension: string;
  price: number;
}

interface ApiProduct extends Product {
  dimensionsOptions?: DimensionOption[];
}

const HomePageContent: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart(); // Use useCart hook for adding popular products to cart
  const [popularProducts, setPopularProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchPopularProducts = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear previous errors
      try {
        const response = await fetch('http://localhost:5000/api/products/popular'); // Use new popular products API
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiProduct[] = await response.json();
        setPopularProducts(data);
      } catch (error: any) {
        console.error("Failed to fetch popular products:", error);
        setError("Failed to load popular products. Please try again later."); // Set user-friendly error message
        // Fallback to static products if API call fails
        setPopularProducts(staticProducts.slice(0, 4));
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchPopularProducts();
  }, []);

  const handleAddToCart = (product: ApiProduct) => {
    const defaultDimension = product.dimensionsOptions && product.dimensionsOptions.length > 0 ? product.dimensionsOptions[0] : undefined;
    addToCart(product, 1, defaultDimension);
  };

  return (
    <Container fluid className="p-0 mb-5">

    <Container className="my-5">
      <h2 className="mb-4 text-dark text-center display-4 fw-bold">{t("Welcome to HardAlum")}</h2>
      <p className="mb-5 text-secondary text-center lead">{t("Your one-stop shop for high-quality aluminum accessories and pieces.")}</p>
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <p className="lead fs-5">{t("Explore our wide range of aluminum products, from extrusions to sheets and pipes. We guarantee quality and durability for all your construction and industrial needs.")}</p>
          <Link to="/products" className="btn btn-primary btn-lg mt-4 px-5 py-3 rounded-pill">{t("View Our Products")}</Link>
        </Col>
      </Row>
    </Container>

    {/* Our Values Section */}
    <Container className="my-5 py-5 bg-light rounded shadow-sm">
      <h2 className="text-center text-dark mb-5 display-5 fw-bold">{t("Our Values")}
      </h2>
      <Row className="text-center g-4">
        <Col md={4} className="mb-4">
          <i className="fas fa-gem fa-5x text-info mb-4"></i>
          <h4 className="text-dark fw-bold mb-3">{t("Quality Assurance")}</h4>
          <p className="text-secondary px-3">{t("We commit to delivering only the highest quality aluminum products that meet stringent industry standards.")}</p>
        </Col>
        <Col md={4} className="mb-4">
          <i className="fas fa-handshake fa-5x text-info mb-4"></i>
          <h4 className="text-dark fw-bold mb-3">{t("Customer Satisfaction")}
          </h4>
          <p className="text-secondary px-3">{t("Our customers are at the heart of everything we do. We strive to exceed expectations with every interaction.")}</p>
        </Col>
        <Col md={4} className="mb-4">
          <i className="fas fa-leaf fa-5x text-info mb-4"></i>
          <h4 className="text-dark fw-bold mb-3">{t("Sustainability")}</h4>
          <p className="text-secondary px-3">{t("We are dedicated to environmentally friendly practices, offering sustainable aluminum solutions.")}</p>
        </Col>
      </Row>
    </Container>

    {/* Popular Products Section */}
    <Container className="my-5 py-5">
      <h2 className="text-center text-dark mb-5 display-5 fw-bold">{t("Popular Products")}
      </h2>
      {error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        loading ? (
          <Row className="row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {Array(4).fill(0).map((_, index) => (
              <Col key={index}>
                <Card className="h-100 shadow-lg border-0 product-card d-flex flex-column">
                  <div className="mx-auto d-block w-75 p-4" style={{ height: '200px', objectFit: 'contain' }}>
                    <Skeleton height="100%" />
                  </div>
                  <Card.Body className="d-flex flex-column p-4 text-center flex-grow-1">
                    <Card.Title className="h5 fw-bold mb-2 text-dark">
                      <Skeleton width="80%" />
                    </Card.Title>
                    <Card.Text className="text-secondary mb-3 flex-grow-1 small">
                      <Skeleton count={2} />
                    </Card.Text>
                    <Card.Text className="h4 text-warning fw-bold mt-auto">
                      <Skeleton width="50%" />
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="border-0 bg-white p-3">
                    <Skeleton height={40} />
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          popularProducts.length === 0 ? (
            <NoDataFound message={t("No popular products found. Please check back later.")} />
          ) : (
            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {popularProducts.map((product) => (
                <Col key={product.id}>
                  <Card className="h-100 product-card d-flex flex-column">
                    <div className="product-image-wrapper">
                      <Link to={`/product/${product.id}`}>
                        <img src={product.imageUrl} alt={product.name} />
                      </Link>
                      <div className="product-actions-overlay">
                        <button className="action-icon-button">
                          <FaRegHeart />
                        </button>
                        <Link to={`/product/${product.id}`} className="action-icon-button">
                          <FaEye />
                        </Link>
                      </div>
                    </div>
                    <div className="product-body">
                      <h5 className="product-name">
                        <Link to={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </h5>
                      <p className="product-price">
                        {t("CurrencySymbol")}{product.dimensionsOptions && product.dimensionsOptions.length > 0
                          ? product.dimensionsOptions[0].price.toFixed(2)
                          : Number(product.price || 0).toFixed(2)}
                      </p>
                      <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>
                        <FaShoppingCart /> {t("Add to Cart")}
                      </button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )
        )
      )}
    </Container>
  </Container>
  );
};

function App() {
  const { t } = useTranslation();

  // PrivateRoute component for protecting routes
  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isInitialized } = useAuth();

    if (!isInitialized) {
      return (
        <Container className="my-5 text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">{t("Loading...")}</span>
          </Spinner>
        </Container>
      );
    }

    return user ? <>{children}</> : <Navigate to="/login" replace />;
  };

  return (
    <I18nextProvider i18n={i18n}>
      <CartProvider>
        <Router>
          <AuthProvider> {/* Wrap with AuthProvider */}
            <div className="d-flex flex-column min-vh-100 bg-light">
              <Header />
              <Routes>
                <Route path="/" element={
                  <>
                    {/* Hero Section - Full Width, outside main container */}
                    <section className="hero-section bg-light py-5">
                      <Container>
                        <Row className="align-items-center min-vh-75">
                          <Col lg={5} className="mb-5 mb-lg-0">
                            <div className="hero-content">
                              <h1 className="display-4 fw-bold text-dark mb-3">
                                {t("Premium Aluminum Solutions")}
                              </h1>
                              <h2 className="h3 text-secondary mb-4 fw-light">
                                {t("Quality Products for Every Project")}
                              </h2>
                              <p className="lead text-muted mb-4 fs-5">
                                {t("Discover our comprehensive range of high-quality aluminum products designed for construction, architecture, and industrial applications. Durable, reliable, and built to last.")}
                              </p>
                              <div className="hero-buttons">
                  <Link to="/products" className="btn btn-primary px-4 py-2 rounded-pill me-3 mb-3">
                    <i className="fas fa-shopping-bag me-2"></i>
                    {t("Shop Now")}
                  </Link>
                  <Link to="/contact" className="btn btn-outline-secondary px-4 py-2 rounded-pill mb-3">
                    {t("Get Quote")}
                  </Link>
                              </div>
                            </div>
                          </Col>
                          <Col lg={7} className="text-center">
                            <div className="hero-image-container">
                              <img
                                src={aluminumAccessories}
                                alt="Premium Aluminum Products"
                                className="img-fluid rounded shadow-lg"
                              />
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </section>
                    {/* Main content after hero */}
                    <main className="container flex-grow-1 py-4">
                      <HomePageContent />
                    </main>
                  </>
                } />
                <Route path="/products" element={
                  <main className="container flex-grow-1 py-4">
                    <ProductsPage />
                  </main>
                } />
                <Route path="/product/:id" element={
                  <main className="container flex-grow-1 py-4">
                    <ProductDetailsPage />
                  </main>
                } />
                <Route path="/cart" element={
                  <main className="container flex-grow-1 py-4">
                    <CartPage />
                  </main>
                } />
                <Route path="/checkout" element={
                  <main className="container flex-grow-1 py-4">
                    <CheckoutPage />
                  </main>
                } />
                <Route path="/contact" element={
                  <main className="container flex-grow-1 py-4">
                    <ContactPage />
                  </main>
                } />
                <Route path="/signup" element={
                  <main className="container flex-grow-1 py-4">
                    <SignupPage />
                  </main>
                } /> {/* Signup Route */}
                <Route path="/login" element={
                  <main className="container flex-grow-1 py-4">
                    <LoginPage />
                  </main>
                } />   {/* Login Route */}
                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <main className="container flex-grow-1 py-4">
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    </main>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <main className="container flex-grow-1 py-4">
                      <PrivateRoute>
                        <OrderHistoryPage />
                      </PrivateRoute>
                    </main>
                  }
                />
              </Routes>
              <footer className="bg-dark text-white py-5 shadow mt-auto">
                <Container>
                  <Row>
                    <Col md={3} className="mb-4 mb-md-0">
                      <h5 className="text-white mb-3">{t("HardAlum")}</h5>
                      <p className="text-secondary small">{t("Your trusted source for high-quality aluminum accessories and pieces. We are committed to providing durable products and excellent customer service.")}</p>
                      <p className="text-secondary small mb-0">&copy; 2025 {t("HardAlum")}. {t("All rights reserved.")}</p>
                    </Col>

                    <Col md={3} className="mb-4 mb-md-0">
                      <h5 className="text-white mb-3">{t("Quick Links")}
                      </h5>
                      <ul className="list-unstyled">
                        <li><Link to="/" className="text-decoration-none text-secondary">{t("Home")}</Link></li>
                        <li><Link to="/products" className="text-decoration-none text-secondary">{t("Products")}</Link></li>
                        <li><Link to="/about" className="text-decoration-none text-secondary">{t("About Us")}</Link></li>
                        <li><Link to="/contact" className="text-decoration-none text-secondary">{t("Contact")}</Link></li>
                      </ul>
                    </Col>

                    <Col md={3} className="mb-4 mb-md-0">
                      <h5 className="text-white mb-3">{t("Customer Service")}
                      </h5>
                      <ul className="list-unstyled">
                        <li><Link to="/faq" className="text-decoration-none text-secondary">{t("FAQ")}</Link></li>
                        <li><Link to="/shipping" className="text-decoration-none text-secondary">{t("Shipping Info")}</Link></li>
                        <li><Link to="/returns" className="text-decoration-none text-secondary">{t("Returns & Exchanges")}</Link></li>
                        <li><Link to="/privacy" className="text-decoration-none text-secondary">{t("Privacy Policy")}</Link></li>
              </ul>
                    </Col>

                    <Col md={3}>
                      <h5 className="text-white mb-3">{t("Contact Us")}</h5>
                      <p className="text-secondary small mb-1">123 Aluminum St, Metal City, MC 12345</p>
                      <p className="text-secondary small mb-1">{t("Phone")}: (123) 456-7890</p>
                      <p className="text-secondary small mb-3">{t("Email")}: info@hardalum.com</p>

                      <div className="d-flex mt-3">
                        <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
              </div>
                    </Col>
                  </Row>
                  <hr className="my-4 border-secondary" />
                  <div className="text-center">
                    <p className="mb-0 text-secondary small">{t("Designed with")} &hearts; {t("by HardAlum Team")}</p>
          </div>
                </Container>
        </footer>
      </div>
          </AuthProvider> {/* End AuthProvider */}
        </Router>
      </CartProvider>
    </I18nextProvider>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
