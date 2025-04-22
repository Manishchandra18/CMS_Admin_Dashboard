import { Navigate, useRoutes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from '../components/PrivateRoute';
import PostsPage from '../pages/Postspage';
import PostFormPage from '../pages/PostFormPage';
import CategoryManagementPage from '../pages/CategoryManagementPage';
import UserManagementPage from '../pages/UserManagementPage';
import RegisterPage from '../pages/RegisterPage';
import PostViewPage from '../pages/PostViewPage';

export default function AppRoutes() {
  return useRoutes([
    { path: '/', element: <Navigate to="/dashboard" /> },
    { path: '/login', element: <LoginPage /> },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute>
          <DashboardPage  />
        </PrivateRoute>
      ),
    },
    {
        path: '/posts',
        element: (
          <PrivateRoute allowedRoles={['admin', 'editor']}>
            <PostsPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/posts/create',
        element: (
          <PrivateRoute>
            <PostFormPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/posts/edit/:id',
        element: (
          <PrivateRoute>
            <PostFormPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/categories',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <CategoryManagementPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/users',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/posts/view/:id',
        element: (
          <PrivateRoute allowedRoles={['admin', 'editor']}>
            <PostViewPage />
          </PrivateRoute>
        ),
      }
  ]);
}
