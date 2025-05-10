
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Booking, BookingStatus } from '@/lib/types';
import { Eye, ArrowUpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getBookings, getCustomers, getVehicles, saveBooking } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingDetailsView from './BookingDetailsView';

const getBadgeColorForStatus = (status: string) => {
  switch (status) {
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ArchivedBookingsTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [bookingToRestore, setBookingToRestore] = useState<Booking | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Load archived bookings from local storage
    const loadedBookings = getBookings().filter(booking => booking.status === 'archived');
    setBookings(loadedBookings);
    setFilteredBookings(loadedBookings);
  }, []);

  const applyFilters = () => {
    let filtered = [...bookings];
    
    // Get customers for filtering by name
    const customers = getCustomers();

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => {
        const customer = customers.find(c => c.id === booking.customerId);
        return customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply date range filter
    if (startDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.startDate) >= startDate
      );
    }

    if (endDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.endDate) <= new Date(endDate.setHours(23, 59, 59, 999))
      );
    }

    setFilteredBookings(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTimeout(applyFilters, 300);
  };

  const handleDateRangeChange = (type: 'start' | 'end', date?: Date) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setTimeout(applyFilters, 300);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredBookings(bookings);
  };

  const handleView = (booking: Booking) => {
    setViewingBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleRestore = (booking: Booking) => {
    setBookingToRestore(booking);
    setIsRestoreDialogOpen(true);
  };

  const confirmRestore = () => {
    if (!bookingToRestore) return;
    
    // Set status back to completed
    const updatedBooking = {
      ...bookingToRestore,
      status: 'completed' as BookingStatus
    };
    
    // Save to local storage
    saveBooking(updatedBooking);
    
    // Update local state
    const updatedBookings = bookings.filter(b => b.id !== bookingToRestore.id);
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);
    
    setIsRestoreDialogOpen(false);
    
    toast({
      title: t('bookingRestored'),
      description: t('bookingRestoredDesc')
    });
  };

  const customers = getCustomers();
  const vehicles = getVehicles();

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Input
              placeholder={t('searchCustomerName')}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  {startDate ? format(startDate, 'PP') : t('startDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => handleDateRangeChange('start', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="w-full sm:w-48">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  {endDate ? format(endDate, 'PP') : t('endDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => handleDateRangeChange('end', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Button variant="outline" onClick={clearFilters}>
              {t('clearFilters')}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>{t('bookingId')}</TableHead>
              <TableHead>{t('customer')}</TableHead>
              <TableHead>{t('vehicle')}</TableHead>
              <TableHead>{t('startDate')}</TableHead>
              <TableHead>{t('endDate')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('totalPrice')}</TableHead>
              <TableHead>{t('kmDriven')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map(booking => {
              const customer = customers.find(c => c.id === booking.customerId);
              const vehicle = vehicles.find(v => v.id === booking.vehicleId);
              
              return (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{booking.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium">
                    {customer?.name || 'Unknown'}
                    <div className="text-xs text-gray-500">ID: {customer?.id.substring(0, 6) || 'N/A'}</div>
                  </TableCell>
                  <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</TableCell>
                  <TableCell>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(booking.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColorForStatus(booking.status)}>
                      {t(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{booking.totalPrice} {t('currency')}</TableCell>
                  <TableCell>
                    {booking.kmDriven ? `${booking.kmDriven} km` : '-'}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleView(booking)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestore(booking)}
                    >
                      <ArrowUpCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  {t('noBookingsFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation dialog for restoring a booking */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('restoreBooking')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('restoreBookingConfirmation')}
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('bookingDetails')}</DialogTitle>
          </DialogHeader>
          {viewingBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('customer')}</p>
                  <p>{customers.find(c => c.id === viewingBooking.customerId)?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('vehicle')}</p>
                  <p>
                    {(() => {
                      const vehicle = vehicles.find(v => v.id === viewingBooking.vehicleId);
                      return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown';
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('startDate')}</p>
                  <p>{format(new Date(viewingBooking.startDate), 'PP')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('endDate')}</p>
                  <p>{format(new Date(viewingBooking.endDate), 'PP')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('totalPrice')}</p>
                  <p>{viewingBooking.totalPrice} {t('currency')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('kmDriven')}</p>
                  <p>{viewingBooking.kmDriven || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArchivedBookingsTable;
