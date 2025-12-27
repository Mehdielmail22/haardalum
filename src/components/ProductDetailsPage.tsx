import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Card, Form, Carousel, Table, Alert } from 'react-bootstrap'; // Remove Spinner
import { type Product as StaticProduct, products as staticProducts, type DimensionOption } from '../data/products'; // Import DimensionOption
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS

interface ProductDetails extends StaticProduct {
  additionalImages?: string[];
  specifications?: { [key: string]: string };
  dimensionsOptions?: DimensionOption[];
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<DimensionOption | undefined>(undefined);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`); // Adjust URL as needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProductDetails = await response.json();
        setProduct(data);
        // Initialize selectedDimension to the first option if available
        if (data.dimensionsOptions && data.dimensionsOptions.length > 0) {
          setSelectedDimension(data.dimensionsOptions[0]);
        }
      } catch (err: any) {
        console.error("Failed to fetch product details:", err);
        setError("Failed to load product details. Please try again later.");
        // Fallback to static products if API call fails
        const staticProduct = staticProducts.find(p => p.id === parseInt(id || '0'));
        if (staticProduct) {
          setProduct(staticProduct);
          if (staticProduct.dimensionsOptions && staticProduct.dimensionsOptions.length > 0) {
            setSelectedDimension(staticProduct.dimensionsOptions[0]);
          }
        }
      }
      setLoading(false);
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.dimensionsOptions && !selectedDimension) {
      alert(t("Please select a dimension."));
      return;
    }
    // Pass the entire DimensionOption object or undefined if no dimensions
    addToCart(product, quantity, selectedDimension);
  };

  if (loading) {
    return (
      <Container className="my-5">
        <Card className="shadow-lg p-4">
          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <Skeleton height={450} />
            </Col>
            <Col md={6}>
              <h1 className="text-dark fw-bold mb-3"><Skeleton width="80%" /></h1>
              <p className="lead text-secondary mb-4"><Skeleton count={3} /></p>
              <h2 className="text-warning fw-bold mb-4"><Skeleton width="30%" /></h2>
              
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column sm="3" className="fw-bold text-dark"><Skeleton width="70%" /></Form.Label>
                <Col sm="9">
                  <Skeleton height={38} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column sm="3" className="fw-bold text-dark"><Skeleton width="70%" /></Form.Label>
                <Col sm="4">
                  <Skeleton height={38} />
                </Col>
              </Form.Group>

              <Skeleton height={50} className="w-100" />
            
              <h3 className="text-dark mt-5 mb-3"><Skeleton width="50%" /></h3>
              <Skeleton count={4} />
            </Col>
          </Row>
        </Card>
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

  if (!product) {
    return (
      <Container className="my-5">
        <h2 className="text-center text-dark">{t("Product Not Found")}</h2>
        <p className="text-center text-secondary">{t("The product you are looking for does not exist.")}</p>
      </Container>
    );
  }

  // Determine the price to display
  const displayPrice = Number(selectedDimension ? selectedDimension.price : (product.price || (product.dimensionsOptions && product.dimensionsOptions.length > 0 ? product.dimensionsOptions[0].price : 0)));

  return (
    <Container className="my-5">
      <Card className="shadow-lg p-4">
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <Carousel indicators={false}>
              {/* Use product.imageUrl as main image and then additionalImages if available */}
              {product.imageUrl && (
                <Carousel.Item key={product.id}>
                  <Image src={product.imageUrl} fluid rounded className="d-block w-100" style={{ maxHeight: '450px', objectFit: 'contain' }} />
                </Carousel.Item>
              )}
              {product.additionalImages && product.additionalImages.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <Image src={img} fluid rounded className="d-block w-100" style={{ maxHeight: '450px', objectFit: 'contain' }} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={6}>
            <h1 className="text-dark fw-bold mb-3">{product.name}</h1>
            <p className="lead text-secondary mb-4">{product.description}</p>
            <h2 className="text-warning fw-bold mb-4">{t("CurrencySymbol")}{displayPrice.toFixed(2)}</h2>
            
            {/* Dimension selection dropdown */}
            {product.dimensionsOptions && product.dimensionsOptions.length > 0 && (
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column sm="3" className="fw-bold text-dark">{t("Dimensions")}:</Form.Label>
                <Col sm="9">
                  <Form.Select
                    value={selectedDimension?.dimension || ''}
                    onChange={(e) => {
                      const chosenDimension = product.dimensionsOptions?.find(opt => opt.dimension === e.target.value);
                      setSelectedDimension(chosenDimension);
                    }}
                    required
                  >
                    <option value="">{t("Select Dimension")}</option>
                    {product.dimensionsOptions.map((option, idx) => (
                      <option key={idx} value={option.dimension}>{option.dimension}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{t("Please select a dimension.")}</Form.Control.Feedback>
                </Col>
              </Form.Group>
            )}

            <Form.Group as={Row} className="mb-4 align-items-center">
              <Form.Label column sm="3" className="fw-bold text-dark">{t("Quantity")}:</Form.Label>
              <Col sm="4">
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </Col>
            </Form.Group>

            <div className="d-flex gap-3">
              <Button variant="primary" size="lg" onClick={handleAddToCart} className="flex-fill">{t("Add to Cart")}</Button>
              <Button variant="success" size="lg" onClick={() => {
                navigate('/checkout', {
                  state: {
                    directPurchase: {
                      product,
                      quantity,
                      selectedDimension
                    }
                  }
                });
              }} className="flex-fill">{t("Buy Now")}</Button>
            </div>
          
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <h3 className="text-dark mt-5 mb-3">{t("Specifications")}</h3>
            )}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Table striped bordered hover responsive>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="fw-bold">{t(key)}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDetailsPage;
