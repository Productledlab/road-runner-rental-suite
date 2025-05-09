
import { useEffect, useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import UserTable from '@/components/users/UserTable';
import CompanySelector from '@/components/layout/CompanySelector';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/lib/types';
import axios from '@/lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { useCompanies } from '@/hooks/useCompanyData';

const UsersPage = () => {
  const [defaultCompany, setDefaultCompany] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    companies,
    loadCompanyData,
  } = useCompanies();

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


  const handleCompanyChange = (branchId: string) => {
    setSelectedCompany(branchId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Users</h1>
          {!defaultCompany &&
            <CompanySelector onChange={handleCompanyChange} companies={companies} showAllOption={true} />
          }
        </div>

        <UserTable companyId={defaultCompany ? defaultCompany : selectedCompany === 'all' ? undefined : selectedCompany || undefined} companies={companies} />
      </div>
    </AppLayout>
  );
};

export default UsersPage;
