import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user, getToken, handleAuthError, logout } = useAuth(); // Get user, getToken, handleAuthError, and logout from AuthContext
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }); // Fetch profile data without user.id in URL
        if (!response.ok) {
          const isAuthErrorHandled = await handleAuthError(response);
          if (!isAuthErrorHandled) {
            // If handleAuthError did not redirect (e.g., not a 401),
            // we should still log out and redirect for other non-ok responses
            setError("Failed to load profile data. Please log in again.");
            navigate('/login');
          }
          return;
        }
        const data = await response.json();
        setProfileData(data.user);
      } catch (err: any) {
        console.error("Failed to fetch profile data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, getToken, handleAuthError]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">{t("Loading profile...")}</span>
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

  if (!profileData) {
    return (
      <Container className="my-5">
        <h2 className="text-center text-dark">{t("No Profile Data")}</h2>
        <p className="text-center text-secondary">{t("Unable to load user profile information.")}</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h1 className="mb-4 text-center text-dark">{t("User Profile")}</h1>
              <div className="text-center mb-4">
                
                <h3 className="text-dark">{profileData.username}</h3>
                <p className="text-muted">{profileData.email}</p>
              </div>
              <h4 className="text-dark mb-3">{t("Account Details")}</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <strong>{t("User ID")}:</strong>
                  <span>{profileData.id}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <strong>{t("Email")}:</strong>
                  <span>{profileData.email}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <strong>{t("Member Since")}:</strong>
                  <span>{new Date(profileData.created_at).toLocaleDateString()}</span>
                </li>
              </ul>
              <div className="mt-4 text-center">
                <Button variant="outline-danger" onClick={handleLogout}>
                  {t("Logout")}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
