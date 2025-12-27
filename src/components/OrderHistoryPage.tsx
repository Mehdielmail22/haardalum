import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface OrderItem {
  quantity: number;
  price_at_purchase: number;
  product_name: string;
  imageUrl: string;
  dimension?: string;
}

interface Order {
  id: number;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  billing_address: string;
  items: OrderItem[];
}

const OrderHistoryPage: React.FC = () => {
  const { user, getToken, handleAuthError } = useAuth(); // Get user and getToken from AuthContext
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchOrderHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/orders/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }); // Fetch order history without user.id in URL
        if (!response.ok) {
          await handleAuthError(response); // Use handleAuthError
          return;
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("Failed to fetch order history:", err);
        setError("Failed to load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user, navigate, getToken, handleAuthError]); // Add getToken and handleAuthError to dependencies

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">{t("Loading orders...")}</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="my-5">
        <h2 className="text-center text-dark">{t("Not Logged In")}</h2>
        <p className="text-center text-secondary">{t("Please log in to view your order history.")}</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="mb-4 text-center text-dark">{t("Order History")}</h1>
          {orders.length === 0 ? (
            <Alert variant="info" className="text-center">
              {t("You have no orders yet.")}
            </Alert>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="shadow-sm mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--bs-primary)', color: 'white' }}>
                  <h5 className="mb-0">{t("Order #")}{order.id}</h5>
                  <Badge bg="info">{t(order.status)}</Badge>
                </Card.Header>
                <Card.Body>
                  <p><strong>{t("Order Date")}:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                  <p><strong>{t("Total Amount")}:</strong> {t("CurrencySymbol")}{Number(order.total_amount).toFixed(2)}</p>
                  <p><strong>{t("Shipping Address")}:</strong> {order.shipping_address}</p>
                  <h6>{t("Items")}:</h6>
                  <ListGroup variant="flush">
                    {order.items.map((item, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.product_name}</strong> {item.dimension && <small className="text-muted">({item.dimension})</small>}
                          <br />
                          <small>{item.quantity} x {t("CurrencySymbol")}{Number(item.price_at_purchase).toFixed(2)}</small>
                        </div>
                        <span>{t("CurrencySymbol")}{(Number(item.quantity) * Number(item.price_at_purchase)).toFixed(2)}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderHistoryPage;
