import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootState } from '../app/store';
import { JSX } from 'react';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // ✅ new prop
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { token, user } = useAppSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
