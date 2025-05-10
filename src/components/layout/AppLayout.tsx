
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-rental-800 ml-10 md:ml-0">Road Runner Rentals</h1>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span className="hidden sm:inline">{t('logout')}</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
