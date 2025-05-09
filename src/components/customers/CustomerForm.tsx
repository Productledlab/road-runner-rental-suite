
import { useState, useEffect } from 'react';
import { Customer, CustomerType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

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
  branchId: '',
  type: 'new'
};

const CustomerForm = ({ initialData, onSubmit, onCancel }: CustomerFormProps) => {
  const [formData, setFormData] = useState<Customer>(initialData || defaultCustomer);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userRole, setUserRole] = useState<string>('');
  const { t } = useLanguage();
  
  useEffect(() => {
    // Get user role
    const user = JSON.parse(localStorage.getItem('user') || '{"role": ""}');
    setUserRole(user.role || '');

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
        <DialogTitle>{initialData ? t('updateCustomer') : t('addCustomer')}</DialogTitle>
      </DialogHeader>
      
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
        
        {userRole === 'admin' && (
          <div className="space-y-2">
            <Label htmlFor="type">{t('customerType')}</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange('type', value as CustomerType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">{t('new')}</SelectItem>
                <SelectItem value="returning">{t('returning')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
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

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? t('updateCustomer') : t('addCustomer')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CustomerForm;
