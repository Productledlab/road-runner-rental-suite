
import { useState, useEffect } from 'react';
import { Booking, BookingStatus, Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DialogTitle, DialogHeader, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { getCurrentBranch, getCustomers, getAvailableVehicles, saveCustomer } from '@/lib/storage-service';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CustomerForm from '@/components/customers/CustomerForm';

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
  branchId: '',
  startKm: 0,
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [isCompletingBooking, setIsCompletingBooking] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStartDate(new Date(initialData.startDate));
      setEndDate(new Date(initialData.endDate));
      setIsCompletingBooking(initialData.status === 'ongoing');
      
      // Load available vehicles for the date range
      const vehicles = getAvailableVehicles(
        initialData.startDate, 
        initialData.endDate,
        initialData.id
      );
      setAvailableVehicles([...vehicles, { id: initialData.vehicleId, status: 'current' }]);
    } else {
      // Generate a random ID if creating a new booking
      const now = new Date();
      const branchId = getCurrentBranch();
      setFormData({
        ...defaultBooking,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        branchId,
      });
    }
    
    // Load customers from the current branch
    const branchId = getCurrentBranch();
    const loadedCustomers = getCustomers(branchId === 'all' ? undefined : branchId);
    setCustomers(loadedCustomers);
  }, [initialData]);

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // If vehicle changes, recalculate price and set startKm
    if (name === 'vehicleId') {
      calculateTotalPrice(value as string, startDate, endDate);
      
      // Find the vehicle and set startKm
      const vehicle = availableVehicles.find(v => v.id === value);
      if (vehicle) {
        setFormData(prev => ({
          ...prev,
          startKm: vehicle.currentKm || 0
        }));
      }
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
      
      if (!initialData && endDate) {
        // Load available vehicles for the selected date range
        const vehicles = getAvailableVehicles(formattedDate, endDate.toISOString());
        setAvailableVehicles(vehicles);
      }
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
      
      if (!initialData && startDate) {
        // Load available vehicles for the selected date range
        const vehicles = getAvailableVehicles(startDate.toISOString(), formattedDate);
        setAvailableVehicles(vehicles);
      }
    }
  };

  const calculateTotalPrice = (vehicleId: string, start?: Date, end?: Date) => {
    if (!vehicleId || !start || !end) return;

    const vehicle = availableVehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const price = days * vehicle.pricePerDay;

    setFormData(prev => ({
      ...prev,
      totalPrice: price > 0 ? price : 0
    }));
  };

  const handleAddNewCustomer = (customer: Customer) => {
    // Set branch ID
    const branchId = getCurrentBranch();
    const newCustomer = {
      ...customer,
      branchId
    };
    
    // Save customer
    const savedCustomer = saveCustomer(newCustomer);
    
    // Update customers list
    setCustomers(prev => [...prev, savedCustomer]);
    
    // Select the new customer in the form
    setFormData(prev => ({
      ...prev,
      customerId: savedCustomer.id
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
    
    if (isCompletingBooking && !formData.endKm) {
      newErrors.endKm = 'Return km reading is required to complete the booking';
    }
    
    if (isCompletingBooking && formData.endKm && formData.startKm && formData.endKm < formData.startKm) {
      newErrors.endKm = 'Return km reading must be greater than start km reading';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Update the timestamps
      let updatedBooking: Booking = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      // If completing the booking, calculate km driven
      if (isCompletingBooking && updatedBooking.endKm && updatedBooking.startKm) {
        updatedBooking = {
          ...updatedBooking,
          kmDriven: updatedBooking.endKm - updatedBooking.startKm,
          status: 'completed'
        };
      }
      
      onSubmit(updatedBooking);
    }
  };

  const statusOptions: BookingStatus[] = isCompletingBooking 
    ? ['completed', 'cancelled'] 
    : ['pending', 'ongoing', 'completed', 'cancelled'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {initialData ? (isCompletingBooking ? 'Complete Booking' : 'Edit Booking') : 'Create New Booking'}
        </DialogTitle>
        <DialogDescription>
          {isCompletingBooking
            ? 'Enter the return km reading to complete the booking'
            : (initialData ? 'Update booking details' : 'Enter details for the new booking')}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerId">Customer *</Label>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-4">
              <Select 
                value={formData.customerId} 
                onValueChange={(value) => handleChange('customerId', value)}
                disabled={isCompletingBooking}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.type === 'new' ? '(New)' : '(Returning)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('newCustomerAccordion')?.click()}
              className="col-span-1"
              disabled={isCompletingBooking}
            >
              Add
            </Button>
          </div>
          {errors.customerId && <p className="text-sm text-red-500">{errors.customerId}</p>}
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="new-customer">
              <AccordionTrigger id="newCustomerAccordion" className="text-xs">Add New Customer</AccordionTrigger>
              <AccordionContent>
                <CustomerForm 
                  initialData={null}
                  onSubmit={handleAddNewCustomer}
                  onCancel={() => {}}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Vehicle *</Label>
          <Select 
            value={formData.vehicleId} 
            onValueChange={(value) => handleChange('vehicleId', value)}
            disabled={isCompletingBooking || !startDate || !endDate}
          >
            <SelectTrigger>
              <SelectValue placeholder={(!startDate || !endDate) ? 'Select dates first' : 'Select a vehicle'} />
            </SelectTrigger>
            <SelectContent>
              {availableVehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.carNumber}) - {vehicle.pricePerDay} OMR/day
                </SelectItem>
              ))}
              {availableVehicles.length === 0 && startDate && endDate && (
                <SelectItem value="no-vehicles" disabled>
                  No vehicles available for selected dates
                </SelectItem>
              )}
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
                disabled={isCompletingBooking}
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
                disabled={isCompletingBooking}
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
          <Label htmlFor="startKm">Start KM Reading *</Label>
          <Input
            id="startKm"
            name="startKm"
            type="number"
            value={formData.startKm || 0}
            onChange={(e) => handleChange('startKm', parseFloat(e.target.value))}
            placeholder="0"
            disabled={isCompletingBooking}
          />
          {errors.startKm && <p className="text-sm text-red-500">{errors.startKm}</p>}
        </div>
        
        {isCompletingBooking && (
          <div className="space-y-2">
            <Label htmlFor="endKm">Return KM Reading *</Label>
            <Input
              id="endKm"
              name="endKm"
              type="number"
              value={formData.endKm || 0}
              onChange={(e) => handleChange('endKm', parseFloat(e.target.value))}
              placeholder="0"
            />
            {errors.endKm && <p className="text-sm text-red-500">{errors.endKm}</p>}
          </div>
        )}
        
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
            disabled={isCompletingBooking}
          />
          {errors.totalPrice && <p className="text-sm text-red-500">{errors.totalPrice}</p>}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? (isCompletingBooking ? 'Complete Booking' : 'Update Booking') : 'Create Booking'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BookingForm;
