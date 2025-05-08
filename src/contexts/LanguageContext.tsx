
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
  
  // Table headers and column names
  bookingId: { en: "Booking ID", ar: "رقم الحجز" },
  customer: { en: "Customer", ar: "العميل" },
  vehicle: { en: "Vehicle", ar: "المركبة" },
  startDate: { en: "Start Date", ar: "تاريخ البدء" },
  endDate: { en: "End Date", ar: "تاريخ الانتهاء" },
  status: { en: "Status", ar: "الحالة" },
  totalPrice: { en: "Total Price", ar: "السعر الإجمالي" },
  actions: { en: "Actions", ar: "إجراءات" },
  carNumber: { en: "Car Number", ar: "رقم السيارة" },
  year: { en: "Year", ar: "السنة" },
  color: { en: "Color", ar: "اللون" },
  type: { en: "Type", ar: "النوع" },
  fuelType: { en: "Fuel Type", ar: "نوع الوقود" },
  currentKm: { en: "Current KM", ar: "الكيلومترات الحالية" },
  pricePerDay: { en: "Price/Day", ar: "السعر/يوم" },
  name: { en: "Name", ar: "الاسم" },
  phone: { en: "Phone", ar: "الهاتف" },
  dateAdded: { en: "Date Added", ar: "تاريخ الإضافة" },
  
  // Form fields and labels
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  emailAddress: { en: "Email Address", ar: "البريد الإلكتروني" },
  phoneNumber: { en: "Phone Number", ar: "رقم الهاتف" },
  passportNumber: { en: "Passport Number", ar: "رقم جواز السفر" },
  visaNumber: { en: "Visa Number", ar: "رقم التأشيرة" },
  customerType: { en: "Customer Type", ar: "نوع العميل" },
  address: { en: "Address", ar: "العنوان" },
  
  // Booking form
  selectCustomer: { en: "Select a customer", ar: "اختر عميلاً" },
  selectStartDate: { en: "Select start date", ar: "اختر تاريخ البدء" },
  selectEndDate: { en: "Select end date", ar: "اختر تاريخ الانتهاء" },
  selectDatesFirst: { en: "Select dates first", ar: "اختر التواريخ أولا" },
  selectVehicle: { en: "Select a vehicle", ar: "اختر مركبة" },
  noVehiclesAvailable: { en: "No vehicles available for selected dates", ar: "لا توجد مركبات متاحة للتواريخ المحددة" },
  startKm: { en: "Start KM Reading", ar: "قراءة العداد عند البدء" },
  returnKm: { en: "Return KM Reading", ar: "قراءة العداد عند العودة" },
  kmDriven: { en: "Kilometers Driven", ar: "الكيلومترات المقطوعة" },
  
  // Status options
  pending: { en: "Pending", ar: "قيد الانتظار" },
  ongoing: { en: "Ongoing", ar: "جاري" },
  completed: { en: "Completed", ar: "مكتمل" },
  cancelled: { en: "Cancelled", ar: "ملغي" },
  available: { en: "Available", ar: "متاح" },
  booked: { en: "Booked", ar: "محجوز" },
  maintenance: { en: "Maintenance", ar: "صيانة" },
  archived: { en: "Archived", ar: "مؤرشف" },
  
  // Vehicle types
  sedan: { en: "Sedan", ar: "سيدان" },
  suv: { en: "SUV", ar: "دفع رباعي" },
  hatchback: { en: "Hatchback", ar: "هاتشباك" },
  luxury: { en: "Luxury", ar: "فاخرة" },
  van: { en: "Van", ar: "شاحنة صغيرة" },
  
  // Fuel types
  petrol: { en: "Petrol", ar: "بنزين" },
  diesel: { en: "Diesel", ar: "ديزل" },
  electric: { en: "Electric", ar: "كهربائي" },
  hybrid: { en: "Hybrid", ar: "هجين" },
  
  // Customer types
  new: { en: "New", ar: "جديد" },
  returning: { en: "Returning", ar: "عائد" },
  
  // Messages
  searchVehicles: { en: "Search vehicles...", ar: "البحث عن مركبات..." },
  searchCustomerName: { en: "Search by customer name...", ar: "البحث باسم العميل..." },
  allStatuses: { en: "All Statuses", ar: "كل الحالات" },
  allTypes: { en: "All Types", ar: "كل الأنواع" },
  clearFilters: { en: "Clear Filters", ar: "مسح عوامل التصفية" },
  noVehiclesFound: { en: "No vehicles found.", ar: "لم يتم العثور على مركبات." },
  vehicleArchived: { en: "Vehicle archived", ar: "تم أرشفة المركبة" },
  vehicleArchivedDesc: { en: "The vehicle has been moved to the archive.", ar: "تم نقل المركبة إلى الأرشيف." },
  vehicleUpdated: { en: "Vehicle updated", ar: "تم تحديث المركبة" },
  vehicleUpdatedDesc: { en: "Vehicle information has been updated successfully.", ar: "تم تحديث معلومات المركبة بنجاح." },
  vehicleDetails: { en: "Vehicle Details", ar: "تفاصيل المركبة" },
  noBookingsFound: { en: "No bookings found matching the criteria.", ar: "لم يتم العثور على حجوزات تطابق المعايير." },
  bookingUpdated: { en: "Booking updated", ar: "تم تحديث الحجز" },
  bookingUpdatedDesc: { en: "Booking has been updated successfully.", ar: "تم تحديث الحجز بنجاح." },
  bookingCreated: { en: "Booking created", ar: "تم إنشاء الحجز" },
  bookingCreatedDesc: { en: "New booking has been created successfully.", ar: "تم إنشاء حجز جديد بنجاح." },
  newBooking: { en: "New Booking", ar: "حجز جديد" },
  createNewBooking: { en: "Create New Booking", ar: "إنشاء حجز جديد" },
  editBooking: { en: "Edit Booking", ar: "تحرير الحجز" },
  completeBooking: { en: "Complete Booking", ar: "إكمال الحجز" },
  updateBookingDetails: { en: "Update booking details", ar: "تحديث تفاصيل الحجز" },
  enterBookingDetails: { en: "Enter details for the new booking", ar: "أدخل تفاصيل الحجز الجديد" },
  enterReturnKm: { en: "Enter the return km reading to complete the booking", ar: "أدخل قراءة العداد عند العودة لإكمال الحجز" },
  createBooking: { en: "Create Booking", ar: "إنشاء حجز" },
  updateCustomer: { en: "Update Customer", ar: "تحديث العميل" },
  addCustomer: { en: "Add Customer", ar: "إضافة عميل" },
  
  // Currency
  currency: { en: "$", ar: "ر.ع." },
  perDay: { en: "/day", ar: "/يوم" },
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
