// frontend/src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { roleApi } from "./features/roleApi";
import { propertyApi } from "./features/propertyApi";
import propertyDraftReducer from "./features/propertyDraftSlice";
import { locationApi } from "./features/locationApi";
// slices
import authSlice from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query base API
    [propertyApi.reducerPath]: propertyApi.reducer, // Property API
    [roleApi.reducerPath]: roleApi.reducer, // Role API
    propertyDraft: propertyDraftReducer,
    [locationApi.reducerPath]: locationApi.reducer,
    auth: authSlice, // Auth slice
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(locationApi.middleware)
      .concat(apiSlice.middleware)
      .concat(propertyApi.middleware) // اضافه کردن middleware مربوط به propertyApi
      .concat(roleApi.middleware), // اضافه کردن middleware مربوط به roleApi

  devTools: process.env.NODE_ENV !== "production",
});

export default store;
