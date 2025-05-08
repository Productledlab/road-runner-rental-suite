
import { NavLink } from 'react-router-dom';
import { 
  CarFront, 
  Users, 
  Calendar, 
  BarChart3,
  Settings,
  Archive,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Toggle } from '@/components/ui/toggle';

const Sidebar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <div className="w-64 h-screen bg-rental-600 text-white flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="p-6">
        <h2 className="text-2xl font-bold">Road Runner</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <BarChart3 className={`h-5 w-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
              <span>{t('dashboard')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/vehicles" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <CarFront className={`h-5 w-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
              <span>{t('vehicles')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/customers" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Users className={`h-5 w-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
              <span>{t('customers')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/bookings" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Calendar className={`h-5 w-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
              <span>{t('bookings')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/archived-vehicles" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Archive className={`h-5 w-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
              <span>{t('archivedVehicles')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Settings className={`h-5 w-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
              <span>{t('settings')}</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="px-6 py-4 bg-rental-700">
        <div className="flex flex-col space-y-2">
          <div className="text-sm">
            <p className="opacity-80">{t('loggedInAs')}</p>
            <p className="font-medium">{t('adminUser')}</p>
          </div>
          
          <div className="border-t border-rental-600 pt-2 mt-2">
            <Toggle 
              className="flex items-center gap-2 w-full justify-center bg-rental-600 hover:bg-rental-500" 
              pressed={language === 'ar'} 
              onPressedChange={toggleLanguage}
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </Toggle>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
