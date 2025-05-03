
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockBookings, mockCustomers, mockVehicles } from '@/lib/mock-data';
import { Booking, BookingStatus } from '@/lib/types';
import { Edit } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import BookingForm from './BookingForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BookingTable = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const applyFilters = () => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => {
        const customer = mockCustomers.find(c => c.id === booking.customerId);
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
    setEditingBooking(booking);
    setIsDialogOpen(true);
  };

  const handleBookingUpdate = (updatedBooking: Booking) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    );
    
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);
    setIsDialogOpen(false);
  };

  const handleAddNewBooking = () => {
    setEditingBooking(null);
    setIsDialogOpen(true);
  };

  const handleBookingCreate = (newBooking: Booking) => {
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);
    setIsDialogOpen(false);
  };

  const statusOptions: BookingStatus[] = ['pending', 'ongoing', 'completed', 'cancelled'];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  {startDate ? format(startDate, 'PP') : 'Start Date'}
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
                  {endDate ? format(endDate, 'PP') : 'End Date'}
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
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={handleAddNewBooking}
          className="bg-rental-600 hover:bg-rental-700 text-white whitespace-nowrap"
        >
          New Booking
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map(booking => {
              const customer = mockCustomers.find(c => c.id === booking.customerId);
              const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
              
              return (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                  <TableCell className="font-medium">{customer?.name || 'Unknown'}</TableCell>
                  <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</TableCell>
                  <TableCell>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(booking.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColorForStatus(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{booking.totalPrice} OMR</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(booking)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No bookings found matching the criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <BookingForm 
            initialData={editingBooking}
            onSubmit={editingBooking ? handleBookingUpdate : handleBookingCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingTable;
