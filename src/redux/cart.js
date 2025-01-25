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

    // Add product to cart
    addToCart: (state, action) => {
      const { productId, productData } = action.payload;
      const productIndex = state.products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        // If product exists, increase quantity
        state.products[productIndex] = {
          ...state.products[productIndex],
          quantity: state.products[productIndex].quantity + 1,
        };
      } else {
        // If product does not exist, add it to the cart with quantity 1
        state.products.push({
          id: productId,
          quantity: 1,
          ...productData, // Include other product data like name, price, etc.
        });
      }
    },
    removeFromCart: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.productId
      );
      if (productIndex !== -1) {
        if (state.products[productIndex].quantity === 1) {
          state.products = state.products.filter(
            (product) => product.id !== action.payload.productId
          );
        } else {
          state.products[productIndex] = {
            ...state.products[productIndex],
            quantity: state.products[productIndex].quantity - 1,
          };
        }
      }
    },
  },
});

export const { setCart, setLoading, removeFromCart, addToCart } =
  cartSlice.actions;

export default cartSlice.reducer;
