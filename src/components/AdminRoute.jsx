import { Navigate, Outlet } from 'react-router-dom';

export function AdminRoute() {
  const storedUser = localStorage.getItem('user');
  
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}