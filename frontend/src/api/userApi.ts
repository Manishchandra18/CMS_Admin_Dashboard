import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './postsApi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  active: boolean;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['Users'],
    }),
    updateUserRole: builder.mutation<void, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
    updateUserStatus: builder.mutation<void, { id: string; active: boolean }>({
      query: ({ id, active }) => ({
        url: `users/${id}/status`,
        method: 'PATCH',
        body: { active },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} = userApi;
