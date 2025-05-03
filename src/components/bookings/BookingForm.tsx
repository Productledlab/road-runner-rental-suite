
import { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { mockCustomers, mockVehicles } from '@/lib/mock-data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface BookingFormProps {
  initialData: Booking | null;
  onSubmit: (booking: Booking) => void;
  onCancel: () => void;
}

const defaultBooking: Booking = {
  id: '',
  vehicleId: '',
  customerId: '',
  startDate: '',
  endDate: '',
  totalPrice: 0,
  status: 'pending',
  createdAt: '',
  updatedAt: '',
};

const BookingForm = ({ initialData, onSubmit, onCancel }: BookingFormProps) => {
  const [formData, setFormData] = useState<Booking>(initialData || defaultBooking);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.endDate) : undefined
  );
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStartDate(new Date(initialData.startDate));
      setEndDate(new Date(initialData.endDate));
    } else {
      // Generate a random ID if creating a new booking
      const now = new Date();
      setFormData({
        ...defaultBooking,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }
  }, [initialData]);

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // If vehicle changes, recalculate price
    if (name === 'vehicleId') {
      calculateTotalPrice(value as string, startDate, endDate);
    }
  };

  const handleStartDateChange = (date?: Date) => {
    if (date) {
      setStartDate(date);
      const formattedDate = date.toISOString();
      setFormData(prev => ({
        ...prev,
        startDate: formattedDate
      }));
      calculateTotalPrice(formData.vehicleId, date, endDate);
    }
  };

  const handleEndDateChange = (date?: Date) => {
    if (date) {
      setEndDate(date);
      const formattedDate = date.toISOString();
      setFormData(prev => ({
        ...prev,
        endDate: formattedDate
      }));
      calculateTotalPrice(formData.vehicleId, startDate, date);
    }
  };

  const calculateTotalPrice = (vehicleId: string, start?: Date, end?: Date) => {
    if (!vehicleId || !start || !end) return;

    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const price = days * vehicle.pricePerDay;

    setFormData(prev => ({
      ...prev,
      totalPrice: price > 0 ? price : 0
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerId) newErrors.customerId = 'Please select a customer';
    if (!formData.vehicleId) newErrors.vehicleId = 'Please select a vehicle';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.status) newErrors.status = 'Please select a status';
    if (formData.totalPrice <= 0) newErrors.totalPrice = 'Price must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Update the updatedAt timestamp
      const updatedBooking: Booking = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      onSubmit(updatedBooking);
    }
  };

  const statusOptions: BookingStatus[] = ['pending', 'ongoing', 'completed', 'cancelled'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Booking' : 'Create New Booking'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerId">Customer *</Label>
          <Select 
            value={formData.customerId} 
            onValueChange={(value) => handleChange('customerId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {mockCustomers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.customerId && <p className="text-sm text-red-500">{errors.customerId}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Vehicle *</Label>
          <Select 
            value={formData.vehicleId} 
            onValueChange={(value) => handleChange('vehicleId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {mockVehicles
                .filter(v => v.status !== 'archived')
                .map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.carNumber})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.vehicleId && <p className="text-sm text-red-500">{errors.vehicleId}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left ${!startDate && 'text-muted-foreground'}`}
              >
                {startDate ? format(startDate, 'PPP') : 'Select start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left ${!endDate && 'text-muted-foreground'}`}
              >
                {endDate ? format(endDate, 'PPP') : 'Select end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                fromDate={startDate}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleChange('status', value as BookingStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalPrice">Total Price (OMR) *</Label>
          <Input
            id="totalPrice"
            name="totalPrice"
            type="number"
            value={formData.totalPrice}
            onChange={(e) => handleChange('totalPrice', parseFloat(e.target.value))}
            placeholder="0"
          />
          {errors.totalPrice && <p className="text-sm text-red-500">{errors.totalPrice}</p>}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? 'Update Booking' : 'Create Booking'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BookingForm;
