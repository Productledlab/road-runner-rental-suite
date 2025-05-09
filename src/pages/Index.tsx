
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import { jwtDecode } from 'jwt-decode';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      const decoded = jwtDecode(token);
      const { user } = decoded;

      try {
        if (user.role === 'super_admin' || user.role === 'branch_admin') {
          navigate('/companies');
        }
        if (user.role === 'company_admin' || user.role === 'branch_admin') {
          navigate('/dashboard');
        }
      } catch (e) {
        // Invalid user data in localStorage, show login page
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  return <LoginPage />;
};

export default Index;
