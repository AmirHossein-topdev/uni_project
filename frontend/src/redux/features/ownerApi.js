// frontend/src/redux/featuresownersApi.js
import { apiSlice } from "../api/apiSlice";

export const ownerApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 1️⃣ ایجاد مالک جدید
    addOwner: builder.mutation({
      query: (formData) => ({
        url: "/owners/add",
        method: "POST",
        body: formData, // FormData مستقیم
        // headers: { "Content-Type": "multipart/form-data" } ← نذار
      }),
      invalidatesTags: [{ type: "Owner", id: "LIST" }],
    }),

    // 2️⃣ گرفتن همه مالکان با فیلتر و pagination
    getOwners: builder.query({
      query: ({ page = 1, limit = 10, status, type } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);
        if (type) params.append("type", type);
        return `${process.env.NEXT_PUBLIC_API_URL}/owners?${params.toString()}`;
      },
      transformResponse: (response) => response.data?.owners || [], // ← اینجا مهمه
      providesTags: (result) =>
        result
          ? [
              ...result.map((owner) => ({ type: "Owner", id: owner._id })),
              { type: "Owner", id: "LIST" },
            ]
          : [{ type: "Owner", id: "LIST" }],
    }),

    // 3️⃣ گرفتن مالک بر اساس ID
    getOwnerById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_URL}/owners/${id}`,
      transformResponse: (response) => response || {},
      providesTags: (result, error, id) => [{ type: "Owner", id }],
    }),

    // 4️⃣ ویرایش مالک
    updateOwner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/owners/${id}`,
        method: "PUT",
        body: formData, // ← همین FormData
        // headers رو نذار، multer خودش Content-Type رو تنظیم میکنه
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Owner", id },
        { type: "Owner", id: "LIST" },
      ],
    }),

    // 5️⃣ حذف مالک
    deleteOwner: builder.mutation({
      query: (id) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/owners/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Owner", id: "LIST" }],
    }),

    // 6️⃣ تغییر وضعیت مالک
    changeOwnerStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/owners/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Owner", id },
        { type: "Owner", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddOwnerMutation,
  useGetOwnersQuery,
  useGetOwnerByIdQuery,
  useUpdateOwnerMutation,
  useDeleteOwnerMutation,
  useChangeOwnerStatusMutation,
} = ownerApi;
