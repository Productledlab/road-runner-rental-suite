
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-rental-600">404</h1>
        <p className="text-xl text-gray-700 mb-4">{t('notFound')}</p>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          {t('notFoundDesc')}
        </p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-rental-600 hover:bg-rental-700 text-white"
        >
          {t('returnToHome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
