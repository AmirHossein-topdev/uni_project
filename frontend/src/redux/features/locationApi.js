import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:7000/api",
  }),
  endpoints: (builder) => ({
    getLocationEnums: builder.query({
      query: () => "/location-enums",
    }),
  }),
});

export const { useGetLocationEnumsQuery } = locationApi;
