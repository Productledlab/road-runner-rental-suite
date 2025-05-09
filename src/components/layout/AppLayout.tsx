
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t, language } = useLanguage();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed h-screen z-20`}>
        <Sidebar />
      </div>
      
      <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen ? 'md:ms-64' : ''}`}>
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu />
            </Button>
            <h1 className="text-xl font-semibold text-rental-800">Road Runner Rentals</h1>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t('logout')}</span>
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
