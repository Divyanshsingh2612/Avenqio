
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "avenqio-wishlist";

const loadWishlist = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadWishlist(),
};

const saveWishlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some(
        (item) => item.id === product.id
      );

      if (!exists) {
        state.items.push(product);
      }

      saveWishlist(state.items);
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      saveWishlist(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlist(state.items);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
