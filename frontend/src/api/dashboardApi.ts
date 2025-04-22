import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './postsApi'; 

interface StatsResponse {
  stats: {
    totalPosts: number;
    totalUsers: number;
    totalCategories: number;
  };
  recentPosts: {
    id: string;
    title: string;
    author: string;
    status: string;
    date: string;
  }[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  endpoints: (builder) => ({
    getStats: builder.query<StatsResponse, void>({
      query: () => 'dashboard/stats',
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
