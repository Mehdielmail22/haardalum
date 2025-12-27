import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth(); // Get login function from context

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

    if (form.checkValidity() === true) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to register user');
        }

        setSuccess(data.message || 'Registration successful!');
        setFormData({ username: '', email: '', password: '' }); // Clear form
        setValidated(false); // Reset validation

        // Automatically log in the user after successful signup and redirect
        login(data.user, data.token);
        navigate('/');

      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h1 className="mb-4 text-center text-dark">{t("Sign Up")}</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="signupUsername">
                  <Form.Label>{t("Username")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("Enter username")}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{t("Please choose a username.")}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="signupEmail">
                  <Form.Label>{t("Email address")}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t("Enter email")}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{t("Please provide a valid email.")}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="signupPassword">
                  <Form.Label>{t("Password")}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t("Password")}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <Form.Control.Feedback type="invalid">{t("Password must be at least 6 characters.")}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? t("Signing Up...") : t("Sign Up")}
                </Button>
              </Form>
              <p className="text-center mt-3">
                {t("Already have an account?")}{' '}
                <Link to="/login">{t("Login")}</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
