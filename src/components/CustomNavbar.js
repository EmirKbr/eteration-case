import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Container, Row, Col, Offcanvas } from "react-bootstrap";
import { setSearchQuery } from '../store/searchSlice';
import Cart from './Cart';

const CustomNavbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showCart, setShowCart] = useState(false);

    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true);

    const cartItems = useSelector((state) => state.cart.items);

    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const formattedTotalPrice = totalPrice.toFixed(2);

    const normalizeString = (str) => (str ? str.replace(/\s+/g, "").toLowerCase() : "");

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (location.pathname.startsWith('/product/')) {
                event.preventDefault();
                const normalizedQuery = normalizeString(searchTerm);
                dispatch(setSearchQuery(normalizedQuery));
                navigate(`/products?search=${normalizedQuery}`);
            }
        }
    };

    const handleSearchChange = (event) => {
        const inputValue = event.target.value;
        setSearchTerm(inputValue);
        dispatch(setSearchQuery(normalizeString(inputValue)));
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container fluid className='d-flex justify-content-center'>
                <Row className="w-100 align-items-center">
                    <Col xs={12} md={2} className="text-white text-center text-md-start">
                        <Navbar.Brand className="fw-bold text-whites" as={Link} to="/">
                            Eteration
                        </Navbar.Brand>
                    </Col>
                    <Col xs={12} md={8} className="d-flex justify-content-center justify-content-md-start px-2">
                        <Form className="d-flex w-100" style={{ maxWidth: "400px" }}>
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1">
                                    <img src="/searchIcon.svg" alt="Search Icon" width={14} />
                                </span>
                                <FormControl
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    aria-describedby="basic-addon1"
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                        </Form>
                    </Col>
                    <Col xs={12} md={2} className="d-flex justify-content-center justify-content-md-end text-md-end py-2">
                        <Nav className="d-flex align-items-center gap-md-2">
                            <span className="text-white d-flex align-items-center mb-2 mb-md-0" onClick={handleShowCart} style={{ cursor: 'pointer' }}>
                                <img src="/shoppingBagIcon.svg" alt="Shopping Bag" width={14} className="me-2" />
                                {formattedTotalPrice}₺
                            </span>
                            <span className="text-white d-flex align-items-center">
                                <img src="/userIcon.svg" alt="User Icon" width={14} className="me-2" />
                                Emir
                            </span>
                        </Nav>
                    </Col>
                </Row>
            </Container>
            <Offcanvas show={showCart} onHide={handleCloseCart} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Cart />
                </Offcanvas.Body>
            </Offcanvas>
        </Navbar>

    );
};

export default CustomNavbar;