import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { addToCart } from "../store/cartSlicer";
import { useDispatch } from "react-redux";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart(product));
        }
    };
    return (
        <Card
            as={Link}
            to={`/product/${product.id}`}
            className="h-100 d-flex flex-column"
            style={{ textDecoration: 'none' }}
        >
            <div className="position-relative" style={{ paddingBottom: '75%' }}>
                <Card.Img
                    variant="top"
                    src={product.image}
                    className="position-absolute w-100 h-100"
                    style={{ objectFit: 'cover', top: 0, left: 0 }}
                />
            </div>
            <Card.Body className="d-flex flex-column">
                <div className="flex-grow-1">
                    <Card.Title className="text-primary mb-2">{product.price} ₺</Card.Title>
                    <Card.Title className="product-name" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.3em',
                        minHeight: '2.6em'
                    }}>
                        {product.name}
                    </Card.Title>
                </div>
                <Button
                    variant="primary"
                    className="w-100 mt-auto"
                    onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(e);
                    }}
                >
                    Add to Cart
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;