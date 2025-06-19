import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

const PublicRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // Skip if no refreshToken (post-logout or unauthenticated)
      if (!document.cookie.includes('refreshToken')) {
        return;
      }
      try {
        await getCurrentUser();
        // Authenticated: redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (err) {
        // 401 or other errors: stay on public route (login/register)
        console.log('Auth check failed (expected post-logout):', err.message);
      }
    };
    checkAuth();
  }, [navigate]);

  return <Outlet />;
};

export default PublicRoute;