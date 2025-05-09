import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


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
      const token = localStorage.getItem('token');

      if (!token) {
        navigate(redirectTo);
        return;
      }

      try {
        if (token) {
          const decoded = jwtDecode(token);
          const { user } = decoded;

          if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            navigate('/login');
          }

          if (user && allowedRoles.includes(user.role)) {
            setAuthorized(true);

            if (user.role === 'branch_admin' && user.branchId) {
              localStorage.setItem('currentBranch', user.branchId);
            }

            if (user.role === 'company_admin' && user.companyId) {
              localStorage.setItem('currentCompany', user.companyId);
            }
          } else {
            navigate(redirectTo);
          }
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
