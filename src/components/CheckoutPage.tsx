import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, getToken, handleAuthError } = useAuth();

  // Check if this is a direct purchase from Buy Now button
  const directPurchase = location.state?.directPurchase;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });
  const [validated, setValidated] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null); // New state for submission error

  // Pre-fill email for authenticated users
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  // Determine checkout items: either from cart or direct purchase
  const checkoutItems = directPurchase ? [{
    ...directPurchase.product,
    quantity: directPurchase.quantity,
    selectedDimension: directPurchase.selectedDimension,
    price: directPurchase.selectedDimension?.price || directPurchase.product.price
  }] : cart;

  const subtotal = checkoutItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shippingCost = subtotal > 0 ? 15.00 : 0; // Dummy shipping cost
  const total = subtotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    event.preventDefault();
    setSubmissionError(null); // Clear any previous submission errors

    if (form.checkValidity() === true && checkoutItems.length > 0) {
      let userId = user?.id;
      let token = getToken();

      // If user is not authenticated, we need to find or create a user account
      if (!userId) {
        try {
          const findOrCreateUserResponse = await fetch('http://localhost:5000/api/users/find-or-create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              name: formData.name
            }),
          });

          if (!findOrCreateUserResponse.ok) {
            throw new Error('Failed to process user account');
          }

          const userData = await findOrCreateUserResponse.json();
          userId = userData.user.id;

        } catch (error) {
          console.error('Error finding/creating user:', error);
          setSubmissionError("Failed to process your order. Please try again.");
          return;
        }
      }

      const orderItems = checkoutItems.map(item => ({
        productId: item.id,
        dimensionId: item.selectedDimension?.id || null,
        quantity: Number(item.quantity),
        priceAtPurchase: Number(item.price),
      }));

      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            userId,
            totalAmount: total,
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
            billingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`, // Using same for simplicity
            items: orderItems,
          }),
        });

        console.log('CheckoutPage: API Response Status', response.status);
        console.log('CheckoutPage: API Response OK', response.ok);

        if (!response.ok) {
          const errorText = await response.text(); // Read response as text for debugging
          console.error('CheckoutPage: API Error Response Text', errorText);
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText); // Attempt to parse as JSON
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.warn('CheckoutPage: Could not parse error response as JSON', jsonError);
          }
          throw new Error(errorMessage);
        }

        const orderConfirmation = await response.json();
        console.log('Order Placed:', orderConfirmation);

      setOrderPlaced(true);
        setSubmissionError(null); // Clear any submission errors

      // Only clear cart if this wasn't a direct purchase
      if (!directPurchase) {
        clearCart();
      }

        // Redirect to home after a short delay to show success message
      setTimeout(() => {
        navigate('/');
        }, 3000); // Redirect after 3 seconds

      } catch (error: any) {
        console.error("Failed to place order:", error);
        setSubmissionError(error.message || "Failed to place order. Please try again later."); // Set error message
        setOrderPlaced(false); // Ensure orderPlaced is false on error
      }
    }
  };

  if (checkoutItems.length === 0 && !orderPlaced && !submissionError) {
    return (
      <Container className="my-5">
        <h2 className="text-center text-dark">{t("Your cart is empty!")}</h2>
        <p className="text-center text-secondary">{t("Please add items to your cart before proceeding to checkout.")}</p>
        <div className="text-center">
          <Button variant="primary" onClick={() => navigate('/')}>{t("Continue Shopping")}</Button>
        </div>
      </Container>
    );
  }


  return (
    <Container className="my-5">
      {/* <h1 className="mb-4 text-dark text-center">{t("Checkout")}</h1> */}
      <Row>
        <Col md={7}>
          <Card className="shadow-sm mb-4">
            <Card.Header style={{ backgroundColor: 'var(--bs-warning)' }} className="text-white">{t("Shipping Information")}</Card.Header>
            <Card.Body>
              {orderPlaced && (
                <Alert variant="success" className="mb-3">
                  {t("Your order has been placed successfully! Redirecting to home...")}
                </Alert>
              )}
              {submissionError && (
                <Alert variant="danger" className="mb-3">
                  {submissionError}
                </Alert>
              )}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3 flex-column flex-md-row">
                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>{t("Full Name")}</Form.Label>
                    <Form.Control type="text" placeholder={t("Enter full name")} name="name" value={formData.name} onChange={handleChange} required />
                    <Form.Control.Feedback type="invalid">{t("Please provide your full name.")}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>{t("Email")}</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t("Enter email")}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!!user} // Make read-only if user is authenticated
                      required
                    />
                    {user ? (
                      <Form.Text className="text-muted">{t("Email is pre-filled from your account")}</Form.Text>
                    ) : (
                      <Form.Text className="text-muted">{t("An account will be created with this email if it doesn't exist")}</Form.Text>
                    )}
                    <Form.Control.Feedback type="invalid">{t("Please provide a valid email.")}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>{t("Address")}</Form.Label>
                  <Form.Control placeholder={t("1234 Main St")} name="address" value={formData.address} onChange={handleChange} required />
                  <Form.Control.Feedback type="invalid">{t("Please provide your address.")}</Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-3 flex-column flex-md-row">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>{t("City")}</Form.Label>
                    <Form.Control name="city" value={formData.city} onChange={handleChange} required />
                    <Form.Control.Feedback type="invalid">{t("Please provide your city.")}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>{t("Zip")}</Form.Label>
                    <Form.Control name="zip" value={formData.zip} onChange={handleChange} required />
                    <Form.Control.Feedback type="invalid">{t("Please provide a valid zip code.")}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridPhone">
                  <Form.Label>{t("Phone Number")}</Form.Label>
                  <Form.Control type="tel" placeholder={t("Enter phone number")} name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" />
                  <Form.Control.Feedback type="invalid">{t("Please provide a valid 10-digit phone number.")}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" disabled={checkoutItems.length === 0 || orderPlaced}>
                  {t("Place Order (Cash on Delivery)")}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Header style={{ backgroundColor: 'var(--bs-warning)' }} className="text-white">{t("Order Summary")}</Card.Header>
            <Card.Body>
              {orderPlaced && !submissionError && (
                <Alert variant="success" className="mb-3">
                  {t("Your order has been placed successfully!")}
                </Alert>
              )}
              {submissionError && (
                <Alert variant="danger" className="mb-3">
                  {submissionError}
                </Alert>
              )}
              <ListGroup variant="flush">
                {checkoutItems.map((item) => (
                  <ListGroup.Item key={`${item.id}-${item.selectedDimension?.dimension}`} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">
                        <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                          {item.name}
                        </Link>
                      </h6>
                      {item.selectedDimension && <small className="text-muted d-block">{t("Dimension")}: {item.selectedDimension.dimension}</small>}
                      <small className="text-muted">{item.quantity} x {t("CurrencySymbol")}{Number(item.price).toFixed(2)}</small>
                    </div>
                    <span>{t("CurrencySymbol")}{(Number(item.quantity) * Number(item.price)).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <hr />
              <ListGroup variant="flush" className="mt-3">
                <ListGroup.Item className="d-flex justify-content-between text-dark p-0 pb-1">
                  <span>{t("Subtotal")}:</span>
                  <span>{t("CurrencySymbol")}{subtotal.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between text-dark p-0 pb-1">
                  <span>{t("Shipping")}:</span>
                  <span>{t("CurrencySymbol")}{shippingCost.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between text-dark fw-bold bg-light p-0 pt-2">
                  <span>{t("Order Total")}:</span>
                  <span>{t("CurrencySymbol")}{total.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>
              <hr />
              <div className="text-center mt-3">
                <h5 className="text-dark">{t("Payment Method")}: <span className="text-dark">{t("Cash on Delivery")}</span></h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
