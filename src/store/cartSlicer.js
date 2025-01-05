import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const product = action.payload;
            const existingProduct = state.items.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeFromCart(state, action) {
            const productId = action.payload;
            state.items = state.items.filter(item => item.id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        increaseQuantity(state, action) {
            const productId = action.payload;
            const product = state.items.find(item => item.id === productId);
            if (product) {
                product.quantity += 1;
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            }
        },
        decreaseQuantity(state, action) {
            const productId = action.payload;
            const product = state.items.find(item => item.id === productId);
            if (product && product.quantity > 1) {
                product.quantity -= 1;
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            }
        }
    }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
