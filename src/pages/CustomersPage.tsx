
import { useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import CustomerTable from "@/components/customers/CustomerTable";
import BranchSelector from "@/components/layout/BranchSelector";
import { useLanguage } from '@/contexts/LanguageContext';

const CustomersPage = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">{t('customers')}</h1>
          <BranchSelector onChange={handleBranchChange} />
        </div>
        
        <CustomerTable branchId={selectedBranch === 'all' ? undefined : selectedBranch || undefined} />
      </div>
    </AppLayout>
  );
};

export default CustomersPage;
