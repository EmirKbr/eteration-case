import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Cart from '../components/Cart';
import cartReducer, { removeFromCart, increaseQuantity, decreaseQuantity } from '../store/cartSlicer';

// Test için mock store oluşturma helper fonksiyonu
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
        return <Provider store={store}>{children}</Provider>;
    };
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('Cart Component', () => {
    const mockCartItems = [
        { id: 1, name: 'Test Item 1', price: 10.99, quantity: 2 },
        { id: 2, name: 'Test Item 2', price: 20.50, quantity: 1 }
    ];

    const initialState = {
        cart: {
            items: mockCartItems
        }
    };

    test('renders empty cart message when cart is empty', () => {
        renderWithProviders(<Cart />, {
            preloadedState: { cart: { items: [] } }
        });
        
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    test('calculates and displays total price correctly', () => {
        renderWithProviders(<Cart />, { preloadedState: initialState });
        // Total should be: (10.99 * 2) + (20.50 * 1) = 42.48
        expect(screen.getByText('42.48₺')).toBeInTheDocument();
    });

    test('handles quantity increase correctly', () => {
        const { store } = renderWithProviders(<Cart />, { preloadedState: initialState });

        const increaseBtns = screen.getAllByText('+');
        fireEvent.click(increaseBtns[0]); // Increase first item quantity

        const state = store.getState();
        expect(state.cart.items[0].quantity).toBe(3);
    });

    test('handles quantity decrease correctly', () => {
        const { store } = renderWithProviders(<Cart />, { preloadedState: initialState });

        const decreaseBtns = screen.getAllByText('-');
        fireEvent.click(decreaseBtns[0]); // Decrease first item quantity

        const state = store.getState();
        expect(state.cart.items[0].quantity).toBe(1);
    });

    test('removes item when quantity becomes 0', () => {
        const { store } = renderWithProviders(<Cart />, {
            preloadedState: {
                cart: {
                    items: [{ id: 1, name: 'Test Item 1', price: 10.99, quantity: 1 }]
                }
            }
        });

        const decreaseBtn = screen.getByText('-');
        fireEvent.click(decreaseBtn);

        const state = store.getState();
        expect(state.cart.items.length).toBe(0);
    });

    test('checkout button is rendered', () => {
        renderWithProviders(<Cart />, { preloadedState: initialState });
        
        expect(screen.getByText('Checkout')).toBeInTheDocument();
        expect(screen.getByText('Checkout').tagName).toBe('BUTTON');
    });

    test('quantity controls are rendered for each item', () => {
        renderWithProviders(<Cart />, { preloadedState: initialState });

        const plusButtons = screen.getAllByText('+');
        const minusButtons = screen.getAllByText('-');
        const quantities = [
            screen.getByText('2'),
            screen.getByText('1')
        ];

        expect(plusButtons).toHaveLength(2);
        expect(minusButtons).toHaveLength(2);
        expect(quantities).toHaveLength(2);
    });
});