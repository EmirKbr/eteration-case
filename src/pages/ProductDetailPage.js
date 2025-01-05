import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../store/productSlicer";
import { Container, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import Cart from "../components/Cart";
import { addToCart } from "../store/cartSlicer";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
    const foundProduct = products.find((p) => p.id === id);
    setProduct(foundProduct);
    setLoading(false)
  }, [id, products, dispatch, products.length]);

  const handleAddToCart = () => {
    if (product) {
      console.log("Ürün sepete ekleniyor:", product);
      dispatch(addToCart(product));
    } else {
      console.log("Ürün bulunamadı.");
    }
  };

  if (loading) return <div className="d-flex flex-column align-items-center py-5">Ürün yükleniyor...</div>

  return (
    product &&
    <Container fluid className="px-4">
      <Row>
        <div className="d-md-none py-3">
          <Row>
            <Col xs={12}>
              <Button variant="light" onClick={handleShowCart} className="w-100 border-secondary">
                Cart
              </Button>
            </Col>
          </Row>
        </div>
      </Row>
      <Row>
        <Col xs={12} md={9} lg={10} className="py-4">
          <Card className="shadow">
            <Row className="g-0">
              <Col xs={12} lg={6}>
                <Card.Img
                  src={product.image}
                  alt={product.name}
                  className="w-100 p-3 p-lg-4"
                  style={{ objectFit: 'contain' }}
                />
              </Col>
              <Col xs={12} lg={6}>
                <Card.Body className="p-3 p-lg-4">
                  <Card.Title className="mb-2">{product.name}</Card.Title>
                  <Card.Title className="text-primary mb-4">{product.price} ₺</Card.Title>

                  <Button
                    variant="primary"
                    className="w-100 my-3 my-lg-4"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>

                  <Card.Text className="mb-0">{product.description}</Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={3} lg={2} className="d-none d-md-block py-4">
          <div className="sticky-top" style={{ top: '1rem' }}>
            <Cart />
          </div>
        </Col>
      </Row>

      <Offcanvas show={showCart} onHide={handleCloseCart} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Cart />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default ProductDetailPage;
