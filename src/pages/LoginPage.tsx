
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { useLanguage } from '@/contexts/LanguageContext';

const LoginPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rental-800">Road Runner Rentals</h1>
          <p className="text-gray-600">{t('signIn')}</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
