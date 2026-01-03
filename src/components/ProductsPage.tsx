import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Form, Nav, Dropdown, Button, Container, Alert } from 'react-bootstrap';
import { FaRegHeart, FaEye, FaShoppingCart, FaTh, FaList } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { type Product as StaticProduct, products as staticProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS
import NoDataFound from './NoDataFound'; // Import NoDataFound
import axios from 'axios';
import { config } from '../config';

interface DimensionOption {
  id: number;
  dimension: string;
  price: number;
}

interface Product extends StaticProduct {
  dimensionsOptions?: DimensionOption[];
}

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const querySearchTerm = searchParams.get('search') || searchParams.get('query') || '';
  // const [searchTerm, setSearchTerm] = useState(querySearchTerm);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // New state for view mode

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/categories`);
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Set default categories if API fails
        setCategories([
          { id: 1, name: "Aluminum Extrusions" },
          { id: 2, name: "Aluminum Sheets" },
          { id: 3, name: "Aluminum Pipes" },
          { id: 4, name: "Aluminum Connectors" }
        ]);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = querySearchTerm
          ? `${config.API_BASE_URL}/api/search?q=${encodeURIComponent(querySearchTerm)}`
          : `${config.API_BASE_URL}/api/products`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Handle different response formats for search vs regular products
        const productsData = querySearchTerm ? data.products : data;
        setProducts(productsData);
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        // Fallback to static products if API call fails
        setProducts(staticProducts);
      }
      setLoading(false);
    };

    fetchCategories();
    fetchProducts();
  }, [querySearchTerm]); // Re-fetch when querySearchTerm changes

  // React.useEffect(() => {
  //   setSearchTerm(querySearchTerm);
  // }, [querySearchTerm]); // Remove this as searchTerm is no longer local state

  const handleAddToCart = (product: Product) => {
    const defaultDimension = product.dimensionsOptions && product.dimensionsOptions.length > 0 ? product.dimensionsOptions[0] : undefined;
    addToCart(product, 1, defaultDimension);
  };

  let displayedProducts = products;

  if (selectedCategory) {
    const selectedCategoryObj = categories.find(cat => cat.id.toString() === selectedCategory);
    if (selectedCategoryObj) {
      displayedProducts = displayedProducts.filter(product => product.category_name === selectedCategoryObj.name);
    }
  }

  // Helper to get the effective price of a product (either base price or first dimension's price)
  const getEffectivePrice = (product: Product): number => {
    if (product.dimensionsOptions && product.dimensionsOptions.length > 0) {
      return product.dimensionsOptions[0].price;
    }
    return Number(product.price || 0);
  };

  if (sortOrder === "price-asc") {
    displayedProducts.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
  } else if (sortOrder === "price-desc") {
    displayedProducts.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
  }

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container className="my-5">
      {querySearchTerm && (
        <div className="mb-4 p-3 bg-light rounded shadow-sm">
          <h2 className="h4 text-dark mb-0">
            {t("Search Results for")}: "{querySearchTerm}"
          </h2>
          <small className="text-muted">
            {displayedProducts.length} {t("results found")}
          </small>
        </div>
      )}
      {/* {!querySearchTerm && (
        <h1 className="mb-4 text-dark text-center">{t("Products")}</h1>
      )} */}

      <div className="products-top-bar mb-4 p-3 d-flex justify-content-between align-items-center rounded shadow-sm">
        <div className="d-flex align-items-center">
          <div className="view-toggle me-3">
            <Button variant="light" className={`me-2 ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => toggleViewMode('grid')}><FaTh /></Button>
            <Button variant="light" className={`${viewMode === 'list' ? 'active' : ''}`} onClick={() => toggleViewMode('list')}><FaList /></Button>
          </div>
          <span className="text-secondary">{t("Il y a")} {displayedProducts.length} {t("produits.")}</span>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-2 text-secondary">{t("Trier par")}:</span>
          <Dropdown onSelect={(eventKey) => setSortOrder(eventKey as string)}>
            <Dropdown.Toggle variant="outline-secondary">
              {sortOrder === "price-asc" ? t("Prix: Croissant") : sortOrder === "price-desc" ? t("Prix: Décroissant") : t("Choisir")}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="default">{t("Choisir")}</Dropdown.Item>
              <Dropdown.Item eventKey="price-asc">{t("Prix: Croissant")}</Dropdown.Item>
              <Dropdown.Item eventKey="price-desc">{t("Prix: Décroissant")}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <div className={`row g-4 ${viewMode === 'list' ? 'products-list-view' : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4'}`}>
          {loading ? ( // Display skeleton loading when loading is true
            Array(productsPerPage).fill(0).map((_, index) => (
              <Col key={index} className={viewMode === 'list' ? 'col-12' : ''}>
                <Card className={`h-100 product-card ${viewMode === 'list' ? 'product-list-card' : 'd-flex flex-column'}`}>
                  <div className="product-image-wrapper">
                    <Skeleton height={viewMode === 'list' ? 150 : "100%"} width={viewMode === 'list' ? 150 : "100%"} />
                  </div>
                  <div className="product-body">
                    <h5 className="product-name">
                      <Skeleton width="80%" />
                    </h5>
                    {viewMode === 'list' && <p><Skeleton width="60%" /></p>}
                    <p className="product-price">
                      <Skeleton width="50%" />
                    </p>
                    <Skeleton height={40} className="add-to-cart-button" />
                  </div>
                </Card>
              </Col>
            ))
          ) : currentProducts.length > 0 ? (
            currentProducts.map((product) => {
              // Determine the price to display for each product card
              const displayPrice = product.dimensionsOptions && product.dimensionsOptions.length > 0
                ? product.dimensionsOptions[0].price
                : Number(product.price || 0);
              
              // Ensure displayPrice is a number, default to 0 if undefined
              const safeDisplayPrice = Number(displayPrice);

              return (
              <Col key={product.id} className={viewMode === 'list' ? 'col-12' : 'col'}>
                  <Card className={`h-100 product-card ${viewMode === 'list' ? 'product-list-card' : 'd-flex flex-column'}`}>
                    <div className="product-image-wrapper">
                      <Link to={`/product/${product.id}`}>
                        <img src={product.imageUrl} alt={product.name} />
                      </Link>
                      {viewMode === 'grid' && (
                        <div className="product-actions-overlay">
                          <button className="action-icon-button">
                            <FaRegHeart />
                          </button>
                          <Link to={`/product/${product.id}`} className="action-icon-button">
                            <FaEye />
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="product-body">
                      {viewMode === 'list' && <p className="product-brand">{product.brand || 'Marque'}</p>}
                      <h5 className="product-name">
                        <Link to={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </h5>
                      {viewMode === 'list' && <p className="product-description-list">{product.description || 'Description du produit...'}</p>}
                      <p className="product-options">
                        {product.dimensionsOptions && product.dimensionsOptions.length > 0
                          ? `${product.dimensionsOptions.length} ${t("options")}`
                          : t("No options")}
                      </p>
                      <p className="product-price">
                        {t("CurrencySymbol")}{safeDisplayPrice.toFixed(2)}
                      </p>
                      {viewMode === 'list' && <p className="product-stock">En stock</p>}
                      <button className="add-to-cart-button" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
                        <FaShoppingCart /> {t("Add to Cart")}
                      </button>
                    </div>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col className="text-center w-100">
              <NoDataFound
                message={
                  querySearchTerm
                    ? t("No products found for") + ` "${querySearchTerm}". ${t("Try different keywords.")}`
                    : t("No products found matching your criteria.")
                }
              />
            </Col>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Nav>
            {[...Array(totalPages)].map((_, index) => (
              <Nav.Link key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                {index + 1}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      )}
    </Container>
  );
};

export default ProductsPage;
