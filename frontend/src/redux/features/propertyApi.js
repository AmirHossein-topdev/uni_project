// frontend\src\redux\features\propertyApi.js
// frontend/src/redux/features/propertyApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base Query
 */
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + "/properties",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * API Slice
 */
export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery,
  tagTypes: ["Property"],
  endpoints: (builder) => ({
    /* =========================
       Property (Core)
    ========================= */

    createProperty: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    getPropertyById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    getFullProperty: builder.query({
      query: (id) => `/${id}/full`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    updatePropertyStatus: builder.mutation({
      query: ({ propertyId, data }) => ({
        url: `/${propertyId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    deleteProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),

    /* =========================
       Property Sections (One-to-One)
    ========================= */

    upsertIdentity: builder.mutation({
      query: ({ propertyId, data }) => ({
        url: `/${propertyId}/identity`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    upsertLocation: builder.mutation({
      query: ({ propertyId, data }) => ({
        url: `/${propertyId}/location`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    upsertLegalStatus: builder.mutation({
      query: ({ propertyId, data }) => ({
        url: `/${propertyId}/legal`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    upsertOwnership: builder.mutation({
      query: ({ propertyId, data }) => ({
        url: `/${propertyId}/ownership`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    upsertBoundaries: builder.mutation({
      query: ({ propertyId, data }) => ({
        url: `/${propertyId}/boundaries`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    upsertAdditionalInfo: builder.mutation({
      query: ({ propertyId, data }) => ({
        url: `/${propertyId}/additional`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    /* =========================
       List & Search
    ========================= */

    listProperties: builder.query({
      query: (params = {}) => ({
        url: "/",
        params,
      }),
      providesTags: ["Property"],
    }),
  }),
});

/* =========================
   Hooks Export
========================= */

export const {
  // core
  useCreatePropertyMutation,
  useGetPropertyByIdQuery,
  useGetFullPropertyQuery,
  useUpdatePropertyStatusMutation,
  useDeletePropertyMutation,

  // sections
  useUpsertIdentityMutation,
  useUpsertLocationMutation,
  useUpsertLegalStatusMutation,
  useUpsertOwnershipMutation,
  useUpsertBoundariesMutation,
  useUpsertAdditionalInfoMutation,

  // list
  useListPropertiesQuery,
} = propertyApi;
