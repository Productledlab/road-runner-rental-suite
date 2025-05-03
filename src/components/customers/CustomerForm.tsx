
import { useState, useEffect } from 'react';
import { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';

interface CustomerFormProps {
  initialData: Customer | null;
  onSubmit: (customer: Customer) => void;
  onCancel: () => void;
}

const defaultCustomer: Customer = {
  id: '',
  name: '',
  passport: '',
  visa: '',
  phone: '',
  email: '',
  address: '',
  dateAdded: new Date().toISOString().split('T')[0],
};

const CustomerForm = ({ initialData, onSubmit, onCancel }: CustomerFormProps) => {
  const [formData, setFormData] = useState<Customer>(initialData || defaultCustomer);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Generate a random ID if creating a new customer
      setFormData({
        ...defaultCustomer,
        id: Math.random().toString(36).substr(2, 9),
        dateAdded: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.passport.trim()) newErrors.passport = 'Passport number is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
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
          <Label htmlFor="email">Email Address *</Label>
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
          <Label htmlFor="phone">Phone Number *</Label>
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
          <Label htmlFor="passport">Passport Number *</Label>
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
          <Label htmlFor="visa">Visa Number</Label>
          <Input
            id="visa"
            name="visa"
            value={formData.visa || ''}
            onChange={handleChange}
            placeholder="V123456789"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? 'Update Customer' : 'Add Customer'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CustomerForm;
