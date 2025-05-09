import { useState, useEffect } from 'react';
import { Booking, BookingStatus, Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { getCurrentBranch, getCustomers, getVehicles, getAvailableVehicles, saveCustomer, saveVehicle } from '@/lib/storage-service';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

// Create a simplified version of CustomerForm that doesn't use <form> elements
// to avoid nested forms
const CustomerFormSimple = ({ onSubmit }: { onSubmit: (customer: Customer) => void }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Customer>({
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    passport: '',
    visa: '',
    phone: '',
    email: '',
    address: '',
    dateAdded: new Date().toISOString().split('T')[0],
    branchId: getCurrentBranch() || '',
    type: 'new'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if customer with passport already exists
    const customers = getCustomers();
    if (formData.passport) {
      const existingCustomer = customers.find(c => 
        c.passport.toLowerCase() === formData.passport.toLowerCase()
      );
      
      if (existingCustomer) {
        toast({
          title: t('customerExists'),
          description: t('updatingExistingCustomer'),
        });
        
        // Pre-fill form with existing customer data
        setFormData({
          ...existingCustomer,
          // Keep the entered passport but update other fields
          passport: formData.passport
        });
      }
    }
  }, [formData.passport, t, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = t('fullName') + ' ' + t('required');
    if (!formData.passport.trim()) newErrors.passport = t('passportNumber') + ' ' + t('required');
    if (!formData.phone.trim()) newErrors.phone = t('phoneNumber') + ' ' + t('required');
    if (!formData.email.trim()) newErrors.email = t('emailAddress') + ' ' + t('required');
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('enterValidEmail');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('fullName')} *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('emailAddress')} *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">{t('phoneNumber')} *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234-567-8901"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="passport">{t('passportNumber')} *</Label>
          <Input
            id="passport"
            name="passport"
            value={formData.passport}
            onChange={handleChange}
            placeholder="AB1234567"
          />
          {errors.passport && <p className="text-sm text-red-500">{errors.passport}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="visa">{t('visaNumber')}</Label>
          <Input
            id="visa"
            name="visa"
            value={formData.visa || ''}
            onChange={handleChange}
            placeholder="V123456789"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">{t('address')}</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button 
          type="button" 
          className="bg-rental-600 hover:bg-rental-700 text-white"
          onClick={handleSubmit}
        >
          {t('addCustomer')}
        </Button>
      </div>
    </div>
  );
};

interface BookingFormProps {
  initialData: Booking | null;
  onSubmit: (booking: Booking) => void;
  onCancel: () => void;
  isCompleting?: boolean;
  userRole?: string;
}

const defaultBooking: Booking = {
  id: '',
  vehicleId: '',
  customerId: '',
  startDate: '',
  endDate: '',
  totalPrice: 0,
  status: 'ongoing',
  createdAt: '',
  updatedAt: '',
  branchId: '',
  startKm: 0,
};

const BookingForm = ({ initialData, onSubmit, onCancel, isCompleting = false, userRole = '' }: BookingFormProps) => {
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
  const [kmDriven, setKmDriven] = useState<number | undefined>(undefined);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStartDate(new Date(initialData.startDate));
      setEndDate(new Date(initialData.endDate));
      
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
        status: 'ongoing',
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

    // If vehicle changes, set startKm
    if (name === 'vehicleId') {
      // Find the vehicle and set startKm
      const vehicle = availableVehicles.find(v => v.id === value);
      if (vehicle) {
        setFormData(prev => ({
          ...prev,
          startKm: vehicle.currentKm || 0
        }));
      }
    }

    // Calculate km driven when endKm changes
    if (name === 'endKm') {
      const startKm = formData.startKm || 0;
      const endKm = Number(value);
      if (endKm >= startKm) {
        setKmDriven(endKm - startKm);
        
        // Also update formData.kmDriven
        setFormData(prev => ({
          ...prev,
          kmDriven: endKm - startKm
        }));
      } else {
        setKmDriven(undefined);
      }
    }
  };

  const handleStartDateChange = (date?: Date) => {
    // Only allow changing dates if not completing a booking
    if (isCompleting) return;
    
    if (date) {
      setStartDate(date);
      const formattedDate = date.toISOString();
      setFormData(prev => ({
        ...prev,
        startDate: formattedDate
      }));
      
      if (!initialData && endDate) {
        // Load available vehicles for the selected date range
        const vehicles = getAvailableVehicles(formattedDate, endDate.toISOString());
        setAvailableVehicles(vehicles);
      }
    }
  };

  const handleEndDateChange = (date?: Date) => {
    // Only allow changing dates if not completing a booking
    if (isCompleting) return;
    
    if (date) {
      setEndDate(date);
      const formattedDate = date.toISOString();
      setFormData(prev => ({
        ...prev,
        endDate: formattedDate
      }));
      
      if (!initialData && startDate) {
        // Load available vehicles for the selected date range
        const vehicles = getAvailableVehicles(startDate.toISOString(), formattedDate);
        setAvailableVehicles(vehicles);
      }
    }
  };

  const handleAddNewCustomer = (customer: Customer) => {
    // Check if customer with same passport already exists
    const customers = getCustomers();
    const existingCustomer = customers.find(c => 
      c.passport.toLowerCase() === customer.passport.toLowerCase()
    );
    
    let savedCustomer;
    
    if (existingCustomer) {
      // Update existing customer with new details
      savedCustomer = {
        ...existingCustomer,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        visa: customer.visa,
        address: customer.address,
        type: 'returning' as const // Mark as returning customer
      };
      
      toast({
        title: t('customerUpdated'),
        description: t('existingCustomerUpdated')
      });
    } else {
      // Set branch ID for new customer
      savedCustomer = {
        ...customer,
        branchId: getCurrentBranch()
      };
    }
    
    // Save customer
    const result = saveCustomer(savedCustomer);
    
    // Update customers list
    setCustomers(prev => {
      // Remove existing customer with same ID if present
      const filtered = prev.filter(c => c.id !== result.id);
      return [...filtered, result];
    });
    
    // Select the customer in the form
    setFormData(prev => ({
      ...prev,
      customerId: result.id
    }));

    // Hide the customer form
    setShowCustomerForm(false);
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
    
    if (isCompleting) {
      if (!formData.endKm) {
        newErrors.endKm = 'Return km reading is required to complete the booking';
      }
      
      if (formData.endKm && formData.startKm && formData.endKm < formData.startKm) {
        newErrors.endKm = 'Return km reading must be greater than start km reading';
      }
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
      
      // If completing the booking, calculate km driven and set status
      if (isCompleting && updatedBooking.endKm && updatedBooking.startKm) {
        updatedBooking = {
          ...updatedBooking,
          kmDriven: updatedBooking.endKm - updatedBooking.startKm,
          status: 'completed'
        };
        
        // Update the vehicle's current km reading
        const vehicles = getVehicles();
        const vehicle = vehicles.find(v => v.id === updatedBooking.vehicleId);
        if (vehicle) {
          const updatedVehicle = {
            ...vehicle,
            currentKm: updatedBooking.endKm,
            status: 'available' as const
          };
          saveVehicle(updatedVehicle);
        }
      }

      // If creating a new booking, update the vehicle status to booked
      if (!initialData && updatedBooking.vehicleId) {
        const vehicles = getVehicles();
        const vehicle = vehicles.find(v => v.id === updatedBooking.vehicleId);
        if (vehicle) {
          const updatedVehicle = {
            ...vehicle,
            status: 'booked' as const
          };
          saveVehicle(updatedVehicle);
        }
      }
      
      onSubmit(updatedBooking);
    }
  };

  // Determine which fields are editable
  const isCompletedBooking = initialData?.status === 'completed' && !isCompleting;
  const isBranchUser = userRole !== 'admin';
  
  // If branch user is completing a booking, they can only edit price and end KM
  const canOnlyEditPriceAndEndKm = isCompleting && isBranchUser;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogDescription>
        {isCompleting
          ? t('enterReturnKm')
          : (initialData ? t('updateBookingDetails') : t('enterBookingDetails'))}
      </DialogDescription>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Customer Selection */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="customerId">{t('customer')} *</Label>
          <div className="flex flex-col gap-2">
            <Select 
              value={formData.customerId} 
              onValueChange={(value) => handleChange('customerId', value)}
              disabled={isCompleting || isCompletedBooking}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectCustomer')} />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.passport})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {!isCompletedBooking && !isCompleting && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowCustomerForm(!showCustomerForm)}
              >
                {showCustomerForm ? t('cancel') : t('addNewCustomer')}
              </Button>
            )}
          </div>
          {errors.customerId && <p className="text-sm text-red-500">{errors.customerId}</p>}
        </div>
        
        {/* Add Customer Form (conditionally rendered) */}
        {showCustomerForm && !isCompletedBooking && !isCompleting && (
          <div className="col-span-2 border p-4 rounded-md max-h-80 overflow-y-auto">
            <CustomerFormSimple onSubmit={handleAddNewCustomer} />
          </div>
        )}
        
        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">{t('startDate')} *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left ${!startDate && 'text-muted-foreground'}`}
                disabled={isCompleting || isCompletedBooking || canOnlyEditPriceAndEndKm}
                type="button"
              >
                {startDate ? format(startDate, 'PPP') : t('selectStartDate')}
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
        
        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate">{t('endDate')} *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left ${!endDate && 'text-muted-foreground'}`}
                disabled={isCompleting || isCompletedBooking || canOnlyEditPriceAndEndKm}
                type="button"
              >
                {endDate ? format(endDate, 'PPP') : t('selectEndDate')}
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
        
        {/* Vehicle Selection */}
        <div className="space-y-2">
          <Label htmlFor="vehicleId">{t('vehicle')} *</Label>
          <Select 
            value={formData.vehicleId} 
            onValueChange={(value) => handleChange('vehicleId', value)}
            disabled={isCompleting || isCompletedBooking || canOnlyEditPriceAndEndKm || !startDate || !endDate}
          >
            <SelectTrigger>
              <SelectValue placeholder={(!startDate || !endDate) ? t('selectDatesFirst') : t('selectVehicle')} />
            </SelectTrigger>
            <SelectContent>
              {availableVehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.carNumber}) - {vehicle.pricePerDay} {t('currency')}
                </SelectItem>
              ))}
              {availableVehicles.length === 0 && startDate && endDate && (
                <SelectItem value="no-vehicles" disabled>
                  {t('noVehiclesAvailable')}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.vehicleId && <p className="text-sm text-red-500">{errors.vehicleId}</p>}
        </div>
        
        {/* Start KM */}
        <div className="space-y-2">
          <Label htmlFor="startKm">{t('startKm')} *</Label>
          <Input
            id="startKm"
            name="startKm"
            type="number"
            value={formData.startKm || 0}
            onChange={(e) => handleChange('startKm', parseFloat(e.target.value))}
            placeholder="0"
            disabled={isCompleting || isCompletedBooking || canOnlyEditPriceAndEndKm}
          />
          {errors.startKm && <p className="text-sm text-red-500">{errors.startKm}</p>}
        </div>
        
        {/* End KM (Only shown when completing a booking) */}
        {(isCompleting || isCompletedBooking) && (
          <div className="space-y-2">
            <Label htmlFor="endKm">{t('returnKm')} *</Label>
            <Input
              id="endKm"
              name="endKm"
              type="number"
              value={formData.endKm || 0}
              onChange={(e) => handleChange('endKm', parseFloat(e.target.value))}
              placeholder="0"
              disabled={isCompletedBooking}
            />
            {errors.endKm && <p className="text-sm text-red-500">{errors.endKm}</p>}
          </div>
        )}
        
        {/* KM Driven (calculated) */}
        {kmDriven !== undefined && (
          <div className="space-y-2">
            <Label>{t('kmDriven')}</Label>
            <Input
              type="text"
              value={kmDriven}
              readOnly
              className="bg-gray-50"
            />
          </div>
        )}
        
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">{t('status')} *</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleChange('status', value as BookingStatus)}
            disabled={isCompleting || (userRole !== 'admin' && initialData?.status === 'completed')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(userRole === 'admin' 
                ? ['pending', 'ongoing', 'completed', 'cancelled', 'archived'] 
                : (isCompleting ? ['completed'] : ['pending', 'ongoing', 'cancelled'])
              ).map(status => (
                <SelectItem key={status} value={status}>
                  {t(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
        </div>
        
        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="totalPrice">{t('totalPrice')} ({t('currency')}) *</Label>
          <Input
            id="totalPrice"
            name="totalPrice"
            type="number"
            value={formData.totalPrice}
            onChange={(e) => handleChange('totalPrice', parseFloat(e.target.value))}
            placeholder="0"
            // Always allow editing price when completing a booking
            disabled={isCompletedBooking && !isCompleting}
          />
          {errors.totalPrice && <p className="text-sm text-red-500">{errors.totalPrice}</p>}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? (isCompleting ? t('completeBooking') : t('update')) : t('createBooking')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BookingForm;
