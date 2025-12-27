import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface NoDataFoundProps {
  message?: string;
  icon?: React.ElementType;
}

const NoDataFound: React.FC<NoDataFoundProps> = () => {
  const { t } = useTranslation();

  return (
    <Container className="">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '10rem', height: '10rem' }} className="d-block mx-auto mb-4 text-secondary" data-v-4b2f71f1="">
        <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" data-v-4b2f71f1=""></path>
        {/* <circle cx="7" cy="9" r="2" fill="currentColor" opacity="0.3" data-v-4b2f71f1=""></circle> */}
        <circle cx="15" cy="9" r="2" fill="currentColor" opacity="0.3" data-v-4b2f71f1=""></circle>
        {/* <path fill="currentColor" opacity="0.3" d="M8 13h8v2H8z" data-v-4b2f71f1=""></path> */}
        </svg>
          <h5 className="text-dark mb-3">{t("No Data Found")}</h5>
          {/* <p className="lead text-muted">{displayMessage}</p> */}
        </Col>
      </Row>
    </Container>
  );
};

export default NoDataFound;
