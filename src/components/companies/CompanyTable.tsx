
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Company } from '@/lib/types';
import { Edit } from 'lucide-react';
import CompanyForm from './CompanyForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { getCurrentBranch } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';
import { useCompanies } from '@/hooks/useCompanyData';

const CompanyTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  const {
    isLoading,
    companies,
    filteredCompanies,
    setFilteredCompanies,
    loadCompanyData,
    saveCompany,
  } = useCompanies();

  useEffect(() => {
    loadCompanyData();
  }, []);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = companies.filter(Company =>
        Company.name.toLowerCase().includes(term) ||
        Company.email.toLowerCase().includes(term) ||
        Company.phone.includes(term)
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  };

  const handleEdit = (Company: Company) => {
    setEditingCompany(Company);
    setIsDialogOpen(true);
  };

  const handleCompanyUpdate = async (updatedCompany: Company) => {
    const companyToSave = { ...updatedCompany };

    const result = await saveCompany(companyToSave);
    if (result) {
      toast({
        title: "Company updated",
        description: "Company information has been updated successfully.",
      });
      setIsDialogOpen(false);
      await loadCompanyData(); // Refresh the list
    }
  };

  const handleAddNewCompany = () => {
    setEditingCompany(null);
    setIsDialogOpen(true);
  };

  const handleCompanyCreate = async (newCompany: Company) => {
    const companyToSave = {
      ...newCompany,
      branchId: getCurrentBranch()
    };

    const result = await saveCompany(companyToSave);
    if (result) {
      toast({
        title: "Company added",
        description: "New company has been added successfully.",
      });
      setIsDialogOpen(false);
      await loadCompanyData(); // Refresh the list
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search Companys..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleAddNewCompany}
          className="bg-rental-600 hover:bg-rental-700 text-white"
        >
          Add New Company
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map(company => (
              <TableRow key={company.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>
                  <Badge className={company.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {company.status.toLocaleUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(company.dateAdded), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(company)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No Companys found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <CompanyForm
            initialData={editingCompany}
            onSubmit={editingCompany ? handleCompanyUpdate : handleCompanyCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyTable;