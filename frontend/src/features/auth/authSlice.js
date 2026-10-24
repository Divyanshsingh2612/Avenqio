
import { createSlice } from "@reduxjs/toolkit";

const readStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem("avenqio-token") || null,
  user: readStorage("avenqio-user"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, user } = action.payload;

      state.token = access_token;
      state.user = user;

      localStorage.setItem("avenqio-token", access_token);
      localStorage.setItem("avenqio-user", JSON.stringify(user));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("avenqio-token");
      localStorage.removeItem("avenqio-user");
    },

    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("avenqio-user", JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
