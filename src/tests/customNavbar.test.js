import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import CustomNavbar from '../components/CustomNavbar';
import cartReducer from '../store/cartSlicer';
import searchReducer from '../store/searchSlice';

// Mock svg imports
jest.mock('../assets/icons/searchIcon.svg', () => 'search-icon');
jest.mock('../assets/icons/shoppingBagIcon.svg', () => 'shopping-bag-icon');
jest.mock('../assets/icons/userIcon.svg', () => 'user-icon');

const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                cart: cartReducer,
                search: searchReducer
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

describe('CustomNavbar Component', () => {
    const initialState = {
        cart: {
            items: [
                { id: 1, name: 'Test Product', price: 100, quantity: 2 }
            ]
        },
        search: {
            query: ''
        }
    };

    beforeEach(() => {
        // Reset any accumulated calls between tests
        jest.clearAllMocks();
    });

    test('renders brand name correctly', () => {
        renderWithProviders(<CustomNavbar />, { preloadedState: initialState });
        expect(screen.getByText('Eteration')).toBeInTheDocument();
    });

    test('renders search input', () => {
        renderWithProviders(<CustomNavbar />, { preloadedState: initialState });
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    test('displays correct total price', () => {
        renderWithProviders(<CustomNavbar />, { preloadedState: initialState });
        // Format the price with two decimal places
        expect(screen.getByText('200.00₺')).toBeInTheDocument();
    });

    test('handles search input change', () => {
        const { store } = renderWithProviders(<CustomNavbar />, { preloadedState: initialState });
        const searchInput = screen.getByPlaceholderText('Search');
        
        fireEvent.change(searchInput, { target: { value: 'test search' } });
        expect(searchInput.value).toBe('test search');
        expect(store.getState().search.query).toBe('testsearch');
    });

    test('opens cart offcanvas when clicking on cart button', async () => {
        renderWithProviders(<CustomNavbar />, { preloadedState: initialState });
        const cartButton = screen.getByText('200.00₺');
        
        fireEvent.click(cartButton);
        
        // Wait for the Offcanvas to appear
        const cartTitle = await screen.findByText('Cart');
        expect(cartTitle).toBeInTheDocument();
    });

    test('handles search on enter key', () => {
        const { store } = renderWithProviders(<CustomNavbar />, { 
            preloadedState: initialState 
        });
        
        const searchInput = screen.getByPlaceholderText('Search');
        fireEvent.change(searchInput, { target: { value: 'test product' } });
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
        
        expect(store.getState().search.query).toBe('testproduct');
    });

    test('displays user name', () => {
        renderWithProviders(<CustomNavbar />, { preloadedState: initialState });
        expect(screen.getByText('Emir')).toBeInTheDocument();
    });

    test('cart shows correct number of items', () => {
        renderWithProviders(<CustomNavbar />, { 
            preloadedState: {
                cart: {
                    items: [
                        { id: 1, name: 'Product 1', price: 100, quantity: 2 },
                        { id: 2, name: 'Product 2', price: 150, quantity: 1 }
                    ]
                },
                search: { query: '' }
            }
        });
        
        // Total should be (100 * 2) + (150 * 1) = 350
        expect(screen.getByText('350.00₺')).toBeInTheDocument();
    });
});