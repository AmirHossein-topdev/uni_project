// frontend/src/redux/features/propertyApi.js
import { apiSlice } from "../api/apiSlice";

export const propertyApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 1️⃣ ایجاد ملک جدید
    addProperty: builder.mutation({
      query: (formData) => ({
        url: "/properties/add",
        method: "POST",
        body: formData,
        // FormData خودکار Content-Type را ست می‌کند، نیازی به هدر نیست
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    // 2️⃣ گرفتن همه ملک‌ها با فیلتر و pagination
    getProperties: builder.query({
      query: ({ page = 1, limit = 10, status, type, owner } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);
        if (type) params.append("type", type);
        if (owner) params.append("owner", owner);
        return `/properties?${params.toString()}`;
      },
      transformResponse: (response) => response.data?.properties || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((property) => ({
                type: "Property",
                id: property._id,
              })),
              { type: "Property", id: "LIST" },
            ]
          : [{ type: "Property", id: "LIST" }],
    }),

    // 3️⃣ گرفتن ملک بر اساس ID
    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
      transformResponse: (response) => response.data || {},
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    // 4️⃣ ویرایش ملک
    updateProperty: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Property", id },
        { type: "Property", id: "LIST" },
      ],
    }),

    // 5️⃣ حذف ملک
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    // 6️⃣ تغییر وضعیت ملک
    changePropertyStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/properties/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Property", id },
        { type: "Property", id: "LIST" },
      ],
    }),

    // 7️⃣ افزایش شمارنده بازدید
    incrementPropertyViews: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/views`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    // 8️⃣ جستجوی ملک‌ها
    searchProperties: builder.query({
      query: ({ keyword, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        params.append("page", page);
        params.append("limit", limit);
        return `/properties/search?${params.toString()}`;
      },
      transformResponse: (response) => response.data?.properties || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((property) => ({
                type: "Property",
                id: property._id,
              })),
              { type: "Property", id: "LIST" },
            ]
          : [{ type: "Property", id: "LIST" }],
    }),
  }),
});

export const {
  useAddPropertyMutation,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useChangePropertyStatusMutation,
  useIncrementPropertyViewsMutation,
  useSearchPropertiesQuery,
} = propertyApi;
