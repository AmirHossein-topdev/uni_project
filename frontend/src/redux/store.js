// frontend/src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { roleApi } from "./features/roleApi";

// slices
import authSlice from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query base
    [roleApi.reducerPath]: roleApi.reducer, // Role API
    auth: authSlice, // Auth slice
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(roleApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export default store;
