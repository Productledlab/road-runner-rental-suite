
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Branch, Company } from '@/lib/types';
import { Edit } from 'lucide-react';
import BranchForm from './BranchForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { getCurrentBranch } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';
import { useBranchData, useSaveBranch } from '@/hooks/useBranchData';

interface BranchTableProps {
  companyId?: string;
  companies: Company[];
}

const BranchTable = ({ companyId, companies }: BranchTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  const { isLoading, branches, filteredBranches, loadBranchData, setFilteredBranches } = useBranchData();
  const { isSaving, saveBranch } = useSaveBranch();

  useEffect(() => {
    console.log(companyId)
    loadBranchData(companyId);
  }, [companyId]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = branches.filter(branch =>
        branch.name.toLowerCase().includes(term) ||
        branch.location.toLowerCase().includes(term)
      );
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches(branches);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsDialogOpen(true);
  };

  const handleBranchUpdate = async (updatedBranch: Branch) => {
    const branchToSave = { ...updatedBranch };

    const result = await saveBranch(branchToSave);
    if (result) {
      toast({
        title: "Branch updated",
        description: "Branch information has been updated successfully.",
      });
      setIsDialogOpen(false);
      await loadBranchData(); // Refresh the list
    }
  };

  const handleAddNewBranch = () => {
    setEditingBranch(null);
    setIsDialogOpen(true);
  };

  const handleBranchCreate = async (newBranch: Branch) => {
    const branchToSave = {
      ...newBranch,
      branchId: getCurrentBranch()
    };

    const result = await saveBranch(branchToSave);
    if (result) {
      toast({
        title: "Branch added",
        description: "New Branch has been added successfully.",
      });
      setIsDialogOpen(false);
      await loadBranchData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search Branches..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleAddNewBranch}
          className="bg-rental-600 hover:bg-rental-700 text-white"
        >
          Add New Branch
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              {!companyId &&
                <TableHead>Company</TableHead>
              }
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBranches.map(branch => (
              <TableRow key={branch.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.location}</TableCell>
                {!companyId &&
                  <TableCell>{companies.find((item) => item.id == branch.company_id)?.name || 'Unknown'}
                  </TableCell>
                }
                <TableCell>
                  <Badge className={branch.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {branch.status.toLocaleUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(branch.dateAdded), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(branch)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredBranches.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No Branches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <BranchForm
            initialData={editingBranch}
            companies={companies}
            selectedCompany={companyId}
            onSubmit={editingBranch ? handleBranchUpdate : handleBranchCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchTable;