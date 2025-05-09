
import { useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";

import CompanyTable from '@/components/companies/CompanyTable';
import BranchSelector from "@/components/layout/BranchSelector";

const CompaniesPage = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Companies</h1>
          {/* <BranchSelector onChange={handleBranchChange} /> */}
        </div>

        <CompanyTable />
      </div>
    </AppLayout>
  );
};

export default CompaniesPage;
