
import React, { useEffect, useState } from 'react';
import { Branch } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from 'jwt-decode';
import { useBranchData } from '@/hooks/useBranchData';

interface BranchSelectorProps {
  showAllOption?: boolean;
  onChange?: (branchId: string) => void;
}

const BranchSelector = ({ showAllOption = false, onChange }: BranchSelectorProps) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [branchAccess, setBranchAccess] = useState<string | null>(null);
  const [companyAccess, setCompanyAccess] = useState<string | null>(null);
  const { toast } = useToast();


  const { isLoading, branches, filteredBranches, loadBranchData } = useBranchData();

  useEffect(() => {
    loadBranchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const { user } = decoded;

    if (user) {
      try {
        setUserRole(user.role);

        if (user.role === 'company_admin' && user.companyId) {
          setCompanyAccess(user.companyId);
          loadBranchData(user.companyId)
          setSelectedBranch(user.branchId);
          return;
        }
      } catch (e) {
        loadBranchData();
      }
    }
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const decoded = jwtDecode(token);
  //   const { user } = decoded;

  //   if (user) {
  //     try {

  //       if (user.role === 'company_admin' && user.companyId) {

  //       }

  //       if (user.role === 'branch_admin' && user.branchId) {
  //         setBranchAccess(user.branchId);
  //         setSelectedBranch(user.branchId);
  //         if (onChange) {
  //           onChange(user.branchAccess);
  //         }
  //         return;
  //       }
  //     } catch (e) {
  //       console.error('Error parsing user data', e);
  //     }
  //   }
  // }, [onChange]);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);

    if (onChange) {
      onChange(value);
    }

    toast({
      title: "Branch Changed",
      description: `Switched to ${value === 'all' ? 'All Branches' : branches.find(b => b.id === value)?.name || 'Unknown Branch'}`,
    });
  };

  // If user is branch manager, disable selector and show only their branch
  if (userRole === 'branch-manager' && branchAccess) {
    const branchName = branches.find(b => b.id === branchAccess)?.name || branchAccess;

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Branch:</span>
        <span className="px-3 py-1.5 border rounded bg-gray-50">{branchName}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Branch:</span>
      <Select value={selectedBranch} onValueChange={handleBranchChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select branch" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">All Branches</SelectItem>
          )}
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name} ({branch.location})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
