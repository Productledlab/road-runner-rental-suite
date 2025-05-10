
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Customer } from '@/lib/types';
import { Eye, ArrowUpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getCustomers, saveCustomer } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

const ArchivedCustomersTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [customerToRestore, setCustomerToRestore] = useState<Customer | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Load archived customers from local storage
    const loadedCustomers = getCustomers().filter(customer => customer.type === 'archived');
    setCustomers(loadedCustomers);
    setFilteredCustomers(loadedCustomers);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(term) || 
      customer.email.toLowerCase().includes(term) ||
      customer.phone.toLowerCase().includes(term) ||
      customer.passport.toLowerCase().includes(term)
    );
    
    setFilteredCustomers(filtered);
  };

  const handleView = (customer: Customer) => {
    setViewingCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleRestore = (customer: Customer) => {
    setCustomerToRestore(customer);
    setIsRestoreDialogOpen(true);
  };

  const confirmRestore = () => {
    if (!customerToRestore) return;
    
    // Set type back to 'returning'
    const updatedCustomer = {
      ...customerToRestore,
      type: 'returning' as const
    };
    
    // Save to local storage
    saveCustomer(updatedCustomer);
    
    // Update local state
    const updatedCustomers = customers.filter(c => c.id !== customerToRestore.id);
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    
    setIsRestoreDialogOpen(false);
    
    toast({
      title: t('customerRestored'),
      description: t('customerRestoredDesc')
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="w-full md:w-64">
          <Input
            placeholder={t('searchCustomers')}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('phone')}</TableHead>
              <TableHead>{t('passport')}</TableHead>
              <TableHead>{t('dateAdded')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map(customer => (
              <TableRow key={customer.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.passport}</TableCell>
                <TableCell>{format(new Date(customer.dateAdded), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleView(customer)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestore(customer)}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('noCustomersFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation dialog for restoring a customer */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('restoreCustomer')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('restoreCustomerConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore}>
              {t('restore')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('customerDetails')}</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('name')}</p>
                  <p>{viewingCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('email')}</p>
                  <p>{viewingCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('phone')}</p>
                  <p>{viewingCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('passport')}</p>
                  <p>{viewingCustomer.passport}</p>
                </div>
                {viewingCustomer.visa && (
                  <div>
                    <p className="text-sm text-gray-500">{t('visa')}</p>
                    <p>{viewingCustomer.visa}</p>
                  </div>
                )}
                {viewingCustomer.address && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">{t('address')}</p>
                    <p>{viewingCustomer.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArchivedCustomersTable;
