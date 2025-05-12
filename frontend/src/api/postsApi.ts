import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';

// --- Types ---
export interface Post {
  imageUrl: string;
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  status: 'Draft' | 'Published';
  tags: string;
  date: string;
}

interface GetPostsResponse {
  data: Post[];
  total: number;
}

// --- Base Query with Auth & Env Support ---
export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_REACT_APP_API_URL, // dynamic based on env
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// --- API ---
export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery, //  uses dynamic env-based URL
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    // Get paginated posts
    getPosts: builder.query<GetPostsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `posts?page=${page}&limit=${limit}`,
      providesTags: ['Posts'],
    }),

    // Get single post by ID
    getPostById: builder.query<Post, string>({
      query: (id) => `posts/${id}`,
    }),

    // Create a new post
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Posts'],
    }),

    // Update a post
    updatePost: builder.mutation<Post, { id: string; data: Partial<Post> }>({
      query: ({ id, data }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Posts'],
    }),

    // Delete a post
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),
  }),
});

// --- Hooks ---
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
