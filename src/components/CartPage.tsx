import React from 'react';
import { Container, Row, Col, Button, Image, ListGroup, Form, InputGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaMinus, FaBoxOpen } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { products, type DimensionOption } from '../data/products'; // Import products and DimensionOption
import NoDataFound from './NoDataFound'; // Import NoDataFound

const CartPage: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + shippingCost;

  const handleUpdateQuantity = (productId: number, newQuantity: number, selectedDimension?: DimensionOption) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity, selectedDimension);
    } else {
      removeFromCart(productId, selectedDimension);
    }
  };

  const handleDimensionChange = (productId: number, oldDimension: DimensionOption | undefined, newDimension: DimensionOption) => {
    if (newDimension.dimension === oldDimension?.dimension) return; // No change needed if same dimension selected

    const productInCart = cart.find(item => item.id === productId && item.selectedDimension?.dimension === oldDimension?.dimension);
    if (productInCart) {
      // Remove the old item (with old dimension)
      removeFromCart(productId, oldDimension);
      // Add the product back with the new dimension and original quantity
      addToCart(productInCart, productInCart.quantity, newDimension);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Container className="my-5">
      {cart.length === 0 ? (
        <div className="text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '40vh' }}>
          <NoDataFound message={t("Your cart is empty. Start shopping now!")} icon={FaBoxOpen} />
          <Button variant="primary" onClick={() => navigate('/products')} className="mt-3">{t("Continue Shopping")}</Button>
        </div>
      ) : (
        <Row className="w-100">
          <Col md={8}>
            <ListGroup variant="flush">
              {cart.map((item) => {
                const originalProduct = products.find(p => p.id === item.id);
                const displayDimension = item.selectedDimension?.dimension || originalProduct?.dimensionsOptions?.[0]?.dimension;
                const displayPrice = Number(item.selectedDimension ? item.selectedDimension.price : (item.price || originalProduct?.dimensionsOptions?.[0]?.price || 0));

                return (
                  <ListGroup.Item key={`${item.id}-${item.selectedDimension?.dimension}`} className="d-flex align-items-center py-3 cart-item">
                    <Image src={item.imageUrl} thumbnail style={{ width: '120px', height: '120px', objectFit: 'cover' }} className="me-3" />
                    <div className="flex-grow-1">
                      <h5 className="mb-1 text-dark">
                        <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                          {item.name}
                        </Link>
                      </h5>
                      {/* Display selected dimension or the first available option as default */}
                      {displayDimension && (
                        <p className="text-muted mb-1">{t("Dimension")}: {displayDimension}</p>
                      )}

                      {/* Display product description */}
                      {originalProduct?.description && (
                        <p className="text-muted mb-2 small">{originalProduct.description}</p>
                      )}

                      {originalProduct?.dimensionsOptions && originalProduct.dimensionsOptions.length > 0 && (
                        <Form.Group className="mb-2" controlId={`dimension-select-${item.id}-${item.selectedDimension?.dimension}`}>
                          <Form.Label className="visually-hidden">{t("Select Dimension")}</Form.Label>
                          <Form.Select
                            value={item.selectedDimension?.dimension || ''}
                            onChange={(e) => {
                              const chosenDimension = originalProduct.dimensionsOptions?.find(opt => opt.dimension === e.target.value);
                              if (chosenDimension) {
                                handleDimensionChange(item.id, item.selectedDimension, chosenDimension);
                              }
                            }}
                            style={{ width: '200px' }}
                          >
                            {originalProduct.dimensionsOptions.map((option, idx) => (
                              <option key={idx} value={option.dimension}>{option.dimension}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}

                      <p className="text-secondary mb-0">{t("Price")}: {t("CurrencySymbol")}{displayPrice.toFixed(2)}</p>
                      <div className="d-flex align-items-center mt-2 cart-quantity-input-wrapper">
                        <InputGroup style={{ width: '150px' }}>
                          <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.selectedDimension)} disabled={item.quantity <= 1}><FaMinus /></Button>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value), item.selectedDimension)}
                            className="text-center"
                          />
                          <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.selectedDimension)}><FaPlus /></Button>
                        </InputGroup>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <Button variant="outline-primary" size="sm" as="a" href={`/product/${item.id}`}>{t("See Details")}</Button>
                      <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id, item.selectedDimension)}>{t("Remove")}</Button>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <div className="cart-page-buttons">
              <Button variant="outline-danger" className="mt-3" onClick={clearCart}>{t("Clear Cart")}</Button>
              <Button variant="outline-secondary" className="mt-3 ms-2" onClick={() => navigate('/products')}>{t("Continue Shopping")}</Button>
            </div>
          </Col>
          <Col md={4}>
            <ListGroup className="mt-4 mt-md-0 cart-summary">
              <ListGroup.Item className="bg-light fw-bold text-dark">{t("Order Summary")}</ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between text-dark">
                <span>{t("Subtotal")}:</span>
                <span>{t("CurrencySymbol")}{subtotal.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between text-dark">
                <span>{t("Shipping (Estimated)")}:</span>
                <span>{t("CurrencySymbol")}{shippingCost.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between text-dark fw-bold bg-light">
                <span>{t("Total")}:</span>
                <span>{t("CurrencySymbol")}{total.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="primary" className="w-100" onClick={handleProceedToCheckout}>{t("Proceed to Checkout")}</Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPage;
