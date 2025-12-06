// frontend/redux/features/userApi.js
import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userData) => ({
        url: `users/`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    getUserByEmployeeCode: builder.query({
      query: (code) => `users/employee/${code}`,
      transformResponse: (response) => response.data || {},
      providesTags: (result, error, code) => [{ type: "User", id: code }],
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
      transformResponse: (response) => response.data || {},
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation({
      // شکل ورودی: { id, formData }
      query: ({ id, formData }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: formData, // body باید FormData باشه
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    changeUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    listUsers: builder.query({
      query: ({ page = 1, limit = 10, status, role } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (status) params.append("status", status);
        if (role) params.append("role", role);
        return `users?${params.toString()}`;
      },
      transformResponse: (response) => response.data?.users || [],
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map((user) => ({ type: "User", id: user._id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUserByEmployeeCodeQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
  useListUsersQuery,
} = userApi;
