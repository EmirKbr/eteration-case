import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlicer";
import searchReducer from './searchSlice';
import cartReducer from './cartSlicer';

export const store = configureStore({
  reducer: {
    products: productReducer,
    search: searchReducer,
    cart: cartReducer,
  },
});