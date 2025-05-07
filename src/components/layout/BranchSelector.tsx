
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
  const { toast } = useToast();

  useEffect(() => {
    const loadedBranches = getBranches();
    setBranches(loadedBranches);

    const current = getCurrentBranch();
    setSelectedBranch(current);
  }, []);

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
