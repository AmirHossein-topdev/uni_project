// frontend/src/redux/features/locationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api", // از env یا مسیر نسبی
  }),
  endpoints: (builder) => ({
    getLocationEnums: builder.query({
      query: () => "/enums/location", // مسیر backend route شما
    }),
  }),
});

export const { useGetLocationEnumsQuery } = locationApi;
