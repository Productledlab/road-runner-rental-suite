
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const AuthGuard = ({ children, allowedRoles, redirectTo = '/' }: AuthGuardProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        navigate(redirectTo);
        return;
      }
      
      try {
        const user = JSON.parse(userString);
        if (user && allowedRoles.includes(user.role)) {
          setAuthorized(true);
        } else {
          navigate(redirectTo);
        }
      } catch (e) {
        navigate(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles, redirectTo]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return authorized ? <>{children}</> : null;
};

export default AuthGuard;
