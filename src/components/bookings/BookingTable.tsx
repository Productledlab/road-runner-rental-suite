
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Booking, BookingStatus } from '@/lib/types';
import { Edit, Eye } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import BookingForm from './BookingForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBookings, getCustomers, getVehicles, saveBooking } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface BookingTableProps {
  branchId?: string;
}

const getBadgeColorForStatus = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'ongoing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BookingTable = ({ branchId }: BookingTableProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [completingBooking, setCompletingBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Get user role
    const user = JSON.parse(localStorage.getItem('user') || '{"role": ""}');
    setUserRole(user.role || '');

    // Load bookings from local storage
    const loadedBookings = getBookings(branchId);
    setBookings(loadedBookings);
    setFilteredBookings(loadedBookings);
  }, [branchId]);

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

    // Apply status filter
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    setFilteredBookings(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTimeout(applyFilters, 300);
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
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
    setSelectedStatus('all');
    setFilteredBookings(bookings);
  };

  const handleEdit = (booking: Booking) => {
    // Check if booking is completed and user is not admin
    if (booking.status === 'completed' && userRole !== 'admin') {
      toast({
        title: t('accessDenied'),
        description: t('cannotEditCompletedBooking'),
        variant: 'destructive'
      });
      return;
    }
    
    setEditingBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCompleteBooking = (booking: Booking) => {
    setCompletingBooking(booking);
    setIsConfirmDialogOpen(true);
  };

  const confirmCompleteBooking = () => {
    if (!completingBooking) return;
    
    // Mark as completed and proceed to editing
    const bookingToComplete = {
      ...completingBooking,
      status: 'completed' as BookingStatus
    };
    
    setEditingBooking(bookingToComplete);
    setIsConfirmDialogOpen(false);
    setIsDialogOpen(true);
  };

  const handleBookingUpdate = (updatedBooking: Booking) => {
    // Save to local storage
    saveBooking(updatedBooking);
    
    // Update local state
    const updatedBookings = bookings.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    );
    
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);
    setIsDialogOpen(false);
    
    toast({
      title: t('bookingUpdated'),
      description: t('bookingUpdatedDesc')
    });
  };

  const handleAddNewBooking = () => {
    setEditingBooking(null);
    setIsDialogOpen(true);
  };

  const handleBookingCreate = (newBooking: Booking) => {
    // Save to local storage
    saveBooking(newBooking);
    
    // Update local state
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);
    setIsDialogOpen(false);
    
    toast({
      title: t('bookingCreated'),
      description: t('bookingCreatedDesc')
    });
  };

  const statusOptions: BookingStatus[] = ['pending', 'ongoing', 'completed', 'cancelled', 'archived'];
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
          
          <div className="w-full sm:w-48">
            <Select value={selectedStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {t(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button variant="outline" onClick={clearFilters}>
              {t('clearFilters')}
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={handleAddNewBooking}
          className="bg-rental-600 hover:bg-rental-700 text-white whitespace-nowrap"
        >
          {t('newBooking')}
        </Button>
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
              {/* Show KM driven for completed bookings */}
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
                    {booking.status === 'ongoing' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCompleteBooking(booking)}
                      >
                        {t('complete')}
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(booking)}
                      disabled={booking.status === 'completed' && userRole !== 'admin'}
                    >
                      <Edit className="h-4 w-4" />
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

      {/* Confirmation dialog for completing a booking */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('completeBooking')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('completeBookingConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompleteBooking}>
              {t('proceed')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBooking ? (completingBooking ? t('completeBooking') : t('editBooking')) : t('createNewBooking')}
            </DialogTitle>
          </DialogHeader>
          <BookingForm 
            initialData={editingBooking}
            onSubmit={editingBooking ? handleBookingUpdate : handleBookingCreate}
            onCancel={() => setIsDialogOpen(false)}
            isCompleting={!!completingBooking}
            userRole={userRole}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingTable;
