import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlicer';
import { Container, Row, Col, Pagination, Offcanvas, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCart';
import Filters from '../components/Filters';
import Cart from '../components/Cart';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const searchQuery = useSelector((state) => state.search.query);
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [brandsList, setBrandsList] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleCloseFilter = () => setShowFilter(false);
  const handleShowFilter = () => setShowFilter(true);

  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);
  const productsPerPage = 12;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }

    if (products.length > 0) {
      const uniqueBrands = [...new Set(products.map((product) => product.brand))].sort();
      setBrandsList(uniqueBrands);

      if (selectedBrands.length > 0) {
        const models = products
          .filter((product) => selectedBrands.includes(product.brand))
          .map((product) => product.model);
        setAvailableModels([...new Set(models)].sort());
      } else {
        setAvailableModels([]);
      }

      const normalizeString = (str) => (str ? str.replace(/\s+/g, "").toLowerCase() : "");

      const result = products.filter((product) => {
        const normalizedName = normalizeString(product.name);
        const normalizedQuery = searchQuery;
        return normalizedName.includes(normalizedQuery);
      });

      setFilteredProducts(result);
    }
  }, [status, dispatch, products, selectedBrands, searchQuery]);

  const filterProducts = (products) => {
    return products.filter((product) => {
      const brandMatches =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const modelMatches =
        selectedModels.length === 0 || selectedModels.includes(product.model);
      return brandMatches && modelMatches;
    });
  };

  const sortProducts = (products) => {
    switch (sortOrder) {
      case "oldToNew":
        return products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "newToOld":
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "priceHighToLow":
        return products.sort((a, b) => b.price - a.price);
      case "priceLowToHigh":
        return products.sort((a, b) => a.price - b.price);
      default:
        return products;
    }
  };

  const filteredAndSortedProducts = sortProducts(filterProducts(filteredProducts));
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      navigate("/products?page=1", { replace: true });
    }
  }, [currentPage, totalPages, navigate]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    navigate(`/products?page=${pageNumber}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsisStart = currentPage > 4;
    const showEllipsisEnd = currentPage < totalPages - 3;

    items.push(
      <Pagination.Item
        key={1}
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    if (showEllipsisStart) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      if (!showEllipsisStart || i > currentPage - 3) {
        if (!showEllipsisEnd || i < currentPage + 3) {
          items.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
      }
    }

    if (showEllipsisEnd) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  if (status === "loading") return <div>Yükleniyor...</div>;
  if (status === "failed") return <div>Hata: {error}</div>;

  return (
    <Container fluid className="p-4">
      <Row>
        <div className="d-md-none mb-3">
          <Row>
            <Col xs={6} className="pe-1">
              <Button variant="light" onClick={handleShowFilter} className="w-100 border-secondary">
                Filters
              </Button>
            </Col>
            <Col xs={6} className="ps-1">
              <Button variant="light" onClick={handleShowCart} className="w-100 border-secondary">
                Cart
              </Button>
            </Col>
          </Row>
        </div>

        <Col md={3} lg={2} className="d-none d-md-block">
          <div className="sticky-top" style={{ top: '1rem' }}>
            <Filters
              brandsList={brandsList}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              availableModels={availableModels}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              brandSearch={brandSearch}
              setBrandSearch={setBrandSearch}
              modelSearch={modelSearch}
              setModelSearch={setModelSearch}
            />
          </div>
        </Col>

        <Col xs={12} md={6} lg={8}>
          <Row xs={2} md={2} lg={4} className="g-3">
            {currentProducts.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          <div className="mt-4">
            <Pagination className="justify-content-center flex-wrap">
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {renderPaginationItems()}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </Col>
        <Col md={3} lg={2} className="d-none d-md-block">
          <Cart />
        </Col>
      </Row>

      <Offcanvas show={showFilter} onHide={handleCloseFilter}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Filters
            brandsList={brandsList}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            availableModels={availableModels}
            selectedModels={selectedModels}
            setSelectedModels={setSelectedModels}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            brandSearch={brandSearch}
            setBrandSearch={setBrandSearch}
            modelSearch={modelSearch}
            setModelSearch={setModelSearch}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showCart} onHide={handleCloseCart} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Cart />
        </Offcanvas.Body>
      </Offcanvas>
    </Container >
  );
};

export default ProductsPage;