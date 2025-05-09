
import { useEffect, useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";

import BranchTable from '@/components/branches/BranchTable';
import CompanySelector from '@/components/layout/CompanySelector';
import { useCompanies } from '@/hooks/useCompanyData';
import { jwtDecode } from 'jwt-decode';

const BranchesPage = () => {
  const {
    companies,
    loadCompanyData,
  } = useCompanies();

  const [defaultCompany, setDefaultCompany] = useState<string | null>(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const { user } = decoded;
    loadCompanyData();

    if (user) {
      try {
        if (user.role === 'company_admin' && user.companyId) {
          setDefaultCompany(user.companyId)
          return;
        }
      } catch (e) {

      }
    }
  }, []);

  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleCompanyChange = (branchId: string) => {
    setSelectedCompany(branchId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Companies</h1>
          {!defaultCompany &&
            <CompanySelector onChange={handleCompanyChange} companies={companies} showAllOption={true} />
          }
        </div>

        <BranchTable companyId={defaultCompany ? defaultCompany : selectedCompany === 'all' ? undefined : selectedCompany || undefined} companies={companies} />
      </div>
    </AppLayout>
  );
};

export default BranchesPage;
