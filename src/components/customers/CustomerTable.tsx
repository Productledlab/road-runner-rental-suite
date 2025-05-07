
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Customer, CustomerType } from '@/lib/types';
import { Edit } from 'lucide-react';
import CustomerForm from './CustomerForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { getCustomers, saveCustomer, getCurrentBranch } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';

interface CustomerTableProps {
  branchId?: string;
}

const CustomerTable = ({ branchId }: CustomerTableProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load customers from local storage
    const loadedCustomers = getCustomers(branchId);
    setCustomers(loadedCustomers);
    setFilteredCustomers(loadedCustomers);
  }, [branchId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(term) || 
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        (customer.passport && customer.passport.toLowerCase().includes(term))
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    // Ensure branch ID is preserved
    const customerToSave = {
      ...updatedCustomer,
      branchId: updatedCustomer.branchId || getCurrentBranch()
    };
    
    // Save to local storage
    saveCustomer(customerToSave);
    
    // Update local state
    const updatedCustomers = customers.map(customer => 
      customer.id === customerToSave.id ? customerToSave : customer
    );
    
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    setIsDialogOpen(false);
    
    toast({
      title: "Customer updated",
      description: "Customer information has been updated successfully."
    });
  };

  const handleAddNewCustomer = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };

  const handleCustomerCreate = (newCustomer: Customer) => {
    // Set branch ID
    const customerToSave = {
      ...newCustomer,
      branchId: getCurrentBranch(),
      type: 'new' as CustomerType // Explicitly cast to CustomerType
    };
    
    // Save to local storage
    saveCustomer(customerToSave);
    
    // Update local state
    const updatedCustomers = [...customers, customerToSave];
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    setIsDialogOpen(false);
    
    toast({
      title: "Customer added",
      description: "New customer has been added successfully."
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleAddNewCustomer}
          className="bg-rental-600 hover:bg-rental-700 text-white"
        >
          Add New Customer
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Passport</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map(customer => (
              <TableRow key={customer.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.passport}</TableCell>
                <TableCell>
                  <Badge className={customer.type === 'new' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                    {customer.type}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(customer.dateAdded), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(customer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <CustomerForm 
            initialData={editingCustomer}
            onSubmit={editingCustomer ? handleCustomerUpdate : handleCustomerCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerTable;
