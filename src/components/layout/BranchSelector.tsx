
import React, { useEffect, useState } from 'react';
import { getBranches, getCurrentBranch, setCurrentBranch } from '@/lib/storage-service';
import { Branch } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BranchSelectorProps {
  showAllOption?: boolean;
  onChange?: (branchId: string) => void;
}

const BranchSelector = ({ showAllOption = false, onChange }: BranchSelectorProps) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [branchAccess, setBranchAccess] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadedBranches = getBranches();
    setBranches(loadedBranches);

    // Get user information
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserRole(user.role);
        setBranchAccess(user.branchAccess);
        
        // If branch manager, force their assigned branch
        if (user.role === 'branch-manager' && user.branchAccess) {
          setCurrentBranch(user.branchAccess);
          setSelectedBranch(user.branchAccess);
          
          if (onChange) {
            onChange(user.branchAccess);
          }
          return;
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }

    // For admin, get currently selected branch
    const current = getCurrentBranch();
    setSelectedBranch(current);
  }, [onChange]);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    setCurrentBranch(value);
    
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
