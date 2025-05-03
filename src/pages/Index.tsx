
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.role === 'admin') {
          navigate('/dashboard');
        }
      } catch (e) {
        // Invalid user data in localStorage, show login page
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  return <LoginPage />;
};

export default Index;
