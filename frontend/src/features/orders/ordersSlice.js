
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "avenqio-orders";

const loadOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadOrders(),
};

const saveOrders = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.items.unshift(action.payload);
      saveOrders(state.items);
    },
    clearOrders: (state) => {
      state.items = [];
      saveOrders(state.items);
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
