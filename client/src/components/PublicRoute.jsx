import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

const PublicRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  return <Outlet />;
};

export default PublicRoute;