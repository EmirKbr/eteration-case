import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../store/cartSlicer';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleDecrease = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item.quantity === 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(decreaseQuantity(id));
    }
  };

  const handleIncrease = (id) => {
    dispatch(increaseQuantity(id));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const formattedTotalPrice = totalPrice.toFixed(2);


  return (
    <div className="sticky-top" style={{ top: '1rem' }}>
      <Card className="shadow">
        <Card.Body className="p-2">
          {cartItems.length === 0 ? (
            <p className="mb-0">Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div className="mb-2 pb-2" key={item.id}>
                  <div className="d-flex flex-column">
                    <span className="text-truncate">{item.name}</span>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span className="text-primary">{item.price}₺</span>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="light"
                          size="sm"
                          className="p-0"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => handleDecrease(item.id)}
                        >
                          -
                        </Button>
                        <span
                          className="px-2" style={{ backgroundColor: '#007bff', color: 'white', borderRadius: '4px' }}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="light"
                          size="sm"
                          className="p-0"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => handleIncrease(item.id)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow p-3 mt-4 py-0 px-0">
        <Card.Body>
          <h5 className="mb-3">
            Total Price: <strong className="text-primary">{formattedTotalPrice}₺</strong>
          </h5>
          <Button variant="primary" className="w-100">
            Checkout
          </Button>
        </Card.Body>
      </Card>
    </div>

  );
};

export default Cart;
