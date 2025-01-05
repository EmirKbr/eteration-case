import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../components/ProductCart';
import cartReducer from '../store/cartSlicer';

const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                cart: cartReducer
            },
            preloadedState
        }),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }) => {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </Provider>
        );
    };
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        image: 'test-image.jpg'
    };

    test('renders product information correctly', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);
        
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('99.99 ₺')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
    });

    test('handles add to cart button click', () => {
        const { store } = renderWithProviders(<ProductCard product={mockProduct} />);
        
        const addToCartButton = screen.getByText('Add to Cart');
        fireEvent.click(addToCartButton);

        const state = store.getState();
        expect(state.cart.items).toHaveLength(1);
        expect(state.cart.items[0]).toEqual({
            ...mockProduct,
            quantity: 1
        });
    });
});