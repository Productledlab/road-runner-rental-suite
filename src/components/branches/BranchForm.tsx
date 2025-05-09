
import { useState, useEffect } from 'react';
import { Branch, BranchType, Company } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BranchFormProps {
  initialData: Branch | null;
  companies: Company[];
  onSubmit: (branch: Branch) => void;
  onCancel: () => void;
  selectedCompany?: string
}

const defaultBranch: Branch = {
  id: '',
  name: '',
  location: '',
  company_id: '',
  dateAdded: new Date().toISOString().split('T')[0],
  status: 'active'
};

const BranchForm = ({ initialData, companies, selectedCompany, onSubmit, onCancel }: BranchFormProps) => {
  const [formData, setFormData] = useState<Branch>(initialData || defaultBranch);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultBranch,
        company_id: selectedCompany,
        dateAdded: new Date().toISOString().split('T')[0],
      });
    }

    console.log(selectedCompany)
  }, [initialData, selectedCompany]);

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
    if (!formData.location.trim()) newErrors.phone = 'Location is required';
    if (!formData.company_id) newErrors.company_id = 'Company is required';

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
        <DialogTitle>{initialData ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Branch Name *</Label>
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
          <Label htmlFor="phone">Location *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        {!selectedCompany && !initialData &&
          <div className="space-y-2">
            <Label htmlFor="type">Select Company</Label>
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
          </div>}


        <div className="space-y-2">
          <Label htmlFor="type">Branch Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value as BranchType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? 'Update Branch' : 'Add Branch'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BranchForm;
