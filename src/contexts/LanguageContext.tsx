
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
  // Sidebar items
  dashboard: { en: "Dashboard", ar: "لوحة المعلومات" },
  vehicles: { en: "Vehicles", ar: "المركبات" },
  customers: { en: "Customers", ar: "العملاء" },
  bookings: { en: "Bookings", ar: "الحجوزات" },
  archivedVehicles: { en: "Archived Vehicles", ar: "المركبات المؤرشفة" },
  settings: { en: "Settings", ar: "الإعدادات" },
  loggedInAs: { en: "Logged in as:", ar: "تسجيل الدخول باسم:" },
  adminUser: { en: "Admin User", ar: "مستخدم المسؤول" },
  language: { en: "English", ar: "العربية" },
  
  // Common UI elements
  logout: { en: "Logout", ar: "تسجيل خروج" },
  returnToHome: { en: "Return to Home", ar: "العودة إلى الرئيسية" },
  
  // Dashboard
  recentBookings: { en: "Recent Bookings", ar: "الحجوزات الأخيرة" },
  totalVehicles: { en: "Total Vehicles", ar: "إجمالي المركبات" },
  activeBookings: { en: "Active Bookings", ar: "الحجوزات النشطة" },
  monthlyRevenue: { en: "Monthly Revenue", ar: "الإيرادات الشهرية" },
  fleetStatus: { en: "Fleet Status", ar: "حالة الأسطول" },
  revenue: { en: "Revenue", ar: "الإيرادات" },
  
  // Vehicles page
  addNewVehicle: { en: "Add New Vehicle", ar: "إضافة مركبة جديدة" },
  
  // Customers page
  addNewCustomer: { en: "Add New Customer", ar: "إضافة عميل جديد" },
  
  // Bookings page
  addNewBooking: { en: "Add New Booking", ar: "إضافة حجز جديد" },
  
  // Settings page
  userManagement: { en: "User Management", ar: "إدارة المستخدمين" },
  teamMembers: { en: "Team members and access control.", ar: "أعضاء الفريق والتحكم في الوصول." },
  systemSettings: { en: "System Settings", ar: "إعدادات النظام" },
  configureApp: { en: "Configure application settings.", ar: "تكوين إعدادات التطبيق." },
  nextVersion: { en: "This feature will be implemented in the next version.", ar: "سيتم تنفيذ هذه الميزة في الإصدار التالي." },

  // Form labels and buttons
  cancel: { en: "Cancel", ar: "إلغاء" },
  submit: { en: "Submit", ar: "إرسال" },
  update: { en: "Update", ar: "تحديث" },
  add: { en: "Add", ar: "إضافة" },
  edit: { en: "Edit", ar: "تعديل" },
  delete: { en: "Delete", ar: "حذف" },
  search: { en: "Search", ar: "بحث" },
  filter: { en: "Filter", ar: "تصفية" },
  
  // Login page
  email: { en: "Email", ar: "البريد الإلكتروني" },
  password: { en: "Password", ar: "كلمة المرور" },
  login: { en: "Log in", ar: "تسجيل الدخول" },
  loggingIn: { en: "Logging in...", ar: "جاري تسجيل الدخول..." },
  signIn: { en: "Sign in to access the management portal", ar: "تسجيل الدخول للوصول إلى بوابة الإدارة" },
  demoCredentials: { en: "Demo credentials:", ar: "بيانات اعتماد تجريبية:" },
  invalidCredentials: { en: "Invalid credentials. Try admin@roadrunner.com/admin123 or branch logins.", ar: "بيانات اعتماد غير صالحة. جرب admin@roadrunner.com/admin123 أو تسجيلات الدخول للفروع." },
  enterBothFields: { en: "Please enter both email and password", ar: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
  
  // 404 Page
  notFound: { en: "Oops! Page not found", ar: "عفوا! الصفحة غير موجودة" },
  notFoundDesc: { en: "The page you are looking for might have been removed or is temporarily unavailable.", ar: "الصفحة التي تبحث عنها ربما تمت إزالتها أو غير متاحة مؤقتًا." },
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
