
import { useState, useEffect } from 'react';
import { Branch, Company, User, UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanyFormProps {
  initialData: User | null;
  onSubmit: (company: User) => void;
  onCancel: () => void;
  companies: Company[];
  selectedCompany?: string
  branches: Branch[];
  selectedBranch?: string
}

const defaultCompany: User = {
  id: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  dateAdded: new Date().toISOString().split('T')[0],
  status: 'active'
};

const UserForm = ({ initialData, onSubmit, onCancel, companies, branches, selectedCompany, selectedBranch }: CompanyFormProps) => {
  const [formData, setFormData] = useState<User>(initialData || defaultCompany);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultCompany,
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
        <DialogTitle>{initialData ? 'Edit User' : 'Add New User'}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">User Name *</Label>
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
          <Label htmlFor="phone">Password *</Label>
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
          <Label htmlFor="phone">Confirm Password *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234-567-8901"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        {!selectedCompany && !initialData &&
          <div className="space-y-2">
            <Label htmlFor="type">Select Company {selectedCompany}</Label>
            <Select
              name="company_id"
              value={formData.company_id}
              onValueChange={(value) => handleSelectChange('company_id', value.toString())}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.company_id && <p className="text-sm text-red-500">{errors.company_id}</p>}
          </div>
        }

        {!selectedBranch && !initialData &&
          <div className="space-y-2">
            <Label htmlFor="type">Select Branch</Label>
            <Select
              name="branch_id"
              value={formData.branch_id}
              onValueChange={(value) => handleSelectChange('branch_id', value.toString())}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branch_id && <p className="text-sm text-red-500">{errors.branch_id}</p>}
          </div>
        }

        <div className="space-y-2">
          <Label htmlFor="type">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange('role', value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company_admin">Company Admin</SelectItem>
              <SelectItem value="branch_admin">Branch Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? 'Update Company' : 'Add Company'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;
