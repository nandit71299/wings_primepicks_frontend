import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart_id: null,
  products: [],
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set the entire cart (cart_id and products)
    setCart: (state, action) => {
      state.cart_id = action.payload.cart_id;
      state.products = action.payload.products;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Increase quantity of a product
    increaseQuantity: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.product.id === action.payload.productId
      );
      if (productIndex !== -1) {
        // Using spread to ensure immutability
        state.products[productIndex] = {
          ...state.products[productIndex],
          quantity: state.products[productIndex].quantity + 1,
        };
      }
    },

    // Decrease quantity of the product
    decreaseQuantity: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.product.id === action.payload.productId
      );

      if (productIndex !== -1) {
        // If quantity is 1, remove the product from cart
        if (state.products[productIndex].quantity === 1) {
          state.products = state.products.filter(
            (product) => product.product.id !== action.payload.productId
          );
        } else {
          // Otherwise, decrease quantity
          state.products[productIndex] = {
            ...state.products[productIndex],
            quantity: state.products[productIndex].quantity - 1,
          };
        }
      }
    },
  },
});

export const { setCart, setLoading, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
