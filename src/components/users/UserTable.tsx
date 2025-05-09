
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Company, User } from '@/lib/types';
import { Edit } from 'lucide-react';
import CompanyForm from './UserForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axiosInstance';
import { useBranchData } from '@/hooks/useBranchData';

interface UserTableProps {
  companyId?: string;
  companies: Company[];
}

const UserTable = ({ companyId, companies }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompany, setEditingUsers] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();


  const { branches, filteredBranches, loadBranchData, setFilteredBranches } = useBranchData();

  useEffect(() => {
    loadBranchData(companyId);
  }, [companyId]);



  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const param = companyId ? `company/${companyId}/` : '';
      const response = await axios.get(`/users/${param}`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error: any) {
      toast({
        title: 'Failed',
        description: error?.response?.data?.message || 'No Data found',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (data: User) => {
    setIsLoading(true);
    try {
      let response;

      if (data.id) {
        response = await axios.put(`/companies/${data.id}`, data);
      } else {
        response = await axios.post('/companies/', data);
      }

      return response.data;

    } catch (error: any) {
      toast({
        title: 'Failed',
        description: error?.response?.data?.error || 'Failed',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadUserData();
  }, []);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleEdit = (users: User) => {
    setEditingUsers(users);
    setIsDialogOpen(true);
  };

  const handleUserUpdate = async (updatedUser: User) => {
    const userToSave = { ...updatedUser };

    const result = await saveUser(userToSave);
    if (result) {
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      });
      setIsDialogOpen(false);
      await loadUserData(); // Refresh the list
    }
  };

  const handleAddNewuser = () => {
    setEditingUsers(null);
    setIsDialogOpen(true);
  };

  const handleUserCreate = async (newUser: User) => {
    const userToSave = {
      ...newUser,
    };

    const result = await saveUser(userToSave);
    if (result) {
      toast({
        title: "User created",
        description: "New User has been added successfully.",
      });
      setIsDialogOpen(false);
      await loadUserData(); // Refresh the list
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search Users..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleAddNewuser}
          className="bg-rental-600 hover:bg-rental-700 text-white"
        >
          Add New User
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{companies.find((item) => item.id == user.company_id)?.name || ''}</TableCell>
                <TableCell>{branches.find((item) => item.id == user.branch_id)?.name || ''}</TableCell>
                {/* <TableCell>
                  <Badge className={user.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {user.status.toLocaleUpperCase()}
                  </Badge>
                </TableCell> */}
                {/* <TableCell>{format(new Date(user.dateAdded), 'MMM dd, yyyy')}</TableCell> */}
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No Users found.
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
            onSubmit={editingCompany ? handleUserUpdate : handleUserCreate}
            onCancel={() => setIsDialogOpen(false)}
            companies={companies}
            branches={branches}
            selectedCompany={companyId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;