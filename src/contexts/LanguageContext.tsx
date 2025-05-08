
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'ar';

type Translations = {
  [key: string]: {
    en: string;
    ar: string;
  };
};

// All translatable text goes here
const translations: Translations = {
  dashboard: { en: "Dashboard", ar: "لوحة المعلومات" },
  vehicles: { en: "Vehicles", ar: "المركبات" },
  customers: { en: "Customers", ar: "العملاء" },
  bookings: { en: "Bookings", ar: "الحجوزات" },
  archivedVehicles: { en: "Archived Vehicles", ar: "المركبات المؤرشفة" },
  settings: { en: "Settings", ar: "الإعدادات" },
  loggedInAs: { en: "Logged in as:", ar: "تسجيل الدخول باسم:" },
  adminUser: { en: "Admin User", ar: "مستخدم المسؤول" },
  language: { en: "English", ar: "العربية" },
};

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
