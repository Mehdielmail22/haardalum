import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [validated, setValidated] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      try {
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Contact Form Data Submitted:', await response.json());
        setSubmissionStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setValidated(false); // Reset validation state
        setTimeout(() => setSubmissionStatus('idle'), 5000); // Clear success message after 5 seconds

      } catch (error) {
        console.error("Failed to submit contact form:", error);
        setSubmissionStatus('error');
        setTimeout(() => setSubmissionStatus('idle'), 5000); // Clear error message after 5 seconds
      }
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h1 className="mb-4 text-center text-dark">{t("Contact Us")}</h1>
              <p className="text-center text-secondary mb-4">{t("Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.")}</p>

              {submissionStatus === 'success' && (
                <Alert variant="success" className="mb-4">
                  {t("Thank you for your message! We will get back to you shortly.")}
                </Alert>
              )}
              {submissionStatus === 'error' && (
                <Alert variant="danger" className="mb-4">
                  {t("There was an error submitting your form. Please try again.")}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="contactFormName">
                  <Form.Label>{t("Full Name")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("Enter your name")}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{t("Please provide your full name.")}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactFormEmail">
                  <Form.Label>{t("Email address")}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t("Enter your email")}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{t("Please provide a valid email address.")}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactFormSubject">
                  <Form.Label>{t("Subject")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("Subject of your inquiry")}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{t("Please provide a subject.")}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="contactFormMessage">
                  <Form.Label>{t("Message")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder={t("Your message...")}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{t("Please enter your message.")}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  {t("Submit Message")}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
