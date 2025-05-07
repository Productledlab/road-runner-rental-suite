
import { useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import BookingTable from "@/components/bookings/BookingTable";
import BranchSelector from "@/components/layout/BranchSelector";

const BookingsPage = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Bookings</h1>
          <BranchSelector onChange={handleBranchChange} />
        </div>
        
        <BookingTable branchId={selectedBranch === 'all' ? undefined : selectedBranch || undefined} />
      </div>
    </AppLayout>
  );
};

export default BookingsPage;
