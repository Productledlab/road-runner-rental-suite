
import { useState, useEffect } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import BookingTable from "@/components/bookings/BookingTable";
import BranchSelector from "@/components/layout/BranchSelector";
import { useLanguage } from '@/contexts/LanguageContext';

const BookingsPage = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Get user information
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserRole(user.role);
        
        // If branch manager, use their assigned branch
        if (user.role === 'branch-manager' && user.branchAccess) {
          setSelectedBranch(user.branchAccess);
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">{t('bookings')}</h1>
          <BranchSelector onChange={handleBranchChange} />
        </div>
        
        <BookingTable branchId={selectedBranch === 'all' ? undefined : selectedBranch || undefined} />
      </div>
    </AppLayout>
  );
};

export default BookingsPage;
