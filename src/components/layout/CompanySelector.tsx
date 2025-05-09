
import React, { useState } from 'react';

import { Company } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BranchSelectorProps {
  showAllOption?: boolean;
  companies: Company[];
  onChange?: (companyId: string) => void;
}

const CompanySelector = ({ showAllOption = false, onChange, companies }: BranchSelectorProps) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  // const [userRole, setUserRole] = useState<string>('');
  // const [branchAccess, setBranchAccess] = useState<string | null>(null);
  // const [companyAccess, setCompanyAccess] = useState<string | null>(null);
  // const { toast } = useToast();



  // useEffect(() => {
  //   const loadedBranches = getBranches();
  //   setBranches(loadedBranches);

  //   // Get user information
  //   const token = localStorage.getItem('token');
  //   const decoded = jwtDecode(token);
  //   const { user } = decoded;

  //   if (user) {
  //     try {
  //       const user = JSON.parse(user);
  //       setUserRole(user.role);
  //       setBranchAccess(user.branchAccess);

  //       // If branch manager, force their assigned branch
  //       if (user.role === 'branch-manager' && user.branchAccess) {
  //         setCurrentBranch(user.branchAccess);
  //         setSelectedBranch(user.branchAccess);

  //         if (onChange) {
  //           onChange(user.branchAccess);
  //         }
  //         return;
  //       }
  //     } catch (e) {
  //       console.error('Error parsing user data', e);
  //     }
  //   }

  //   // For admin, get currently selected branch
  //   const current = getCurrentBranch();
  //   setSelectedBranch(current);
  // }, [onChange]);

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    // setCurrentCompany(value);

    if (onChange) {
      onChange(value);
    }

    toast({
      title: "Company Changed",
      description: `Switched to ${value === 'all' ? 'All Companies' : companies.find(b => b.id === value)?.name || 'Unknown Company'}`,
    });
  };


  // if (userRole === 'company_manager' && companyAccess) {
  //   const branchName = companies.find(b => b.id === branchAccess)?.name || branchAccess;

  //   return (
  //     <div className="flex items-center gap-2">
  //       <span className="text-sm font-medium">Branch:</span>
  //       <span className="px-3 py-1.5 border rounded bg-gray-50">{branchName}</span>
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Company:</span>
      <Select value={selectedCompany} onValueChange={handleCompanyChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Company" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">All Companies</SelectItem>
          )}
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;
