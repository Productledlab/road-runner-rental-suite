
import { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, FuelType, VehicleType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';

interface VehicleFormProps {
  initialData: Vehicle | null;
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

const defaultVehicle: Vehicle = {
  id: '',
  carNumber: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  fuelType: 'petrol',
  type: 'sedan',
  status: 'available',
  pricePerDay: 0,
};

const VehicleForm = ({ initialData, onSubmit, onCancel }: VehicleFormProps) => {
  const [formData, setFormData] = useState<Vehicle>(initialData || defaultVehicle);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Generate a random ID if creating a new vehicle
      setFormData({
        ...defaultVehicle,
        id: Math.random().toString(36).substr(2, 9),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'pricePerDay' ? Number(value) : value
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
    
    if (!formData.carNumber.trim()) newErrors.carNumber = 'Car number is required';
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    else if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.pricePerDay) newErrors.pricePerDay = 'Price is required';
    else if (formData.pricePerDay <= 0) newErrors.pricePerDay = 'Price must be greater than 0';
    
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
        <DialogTitle>{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="carNumber">Car Number *</Label>
          <Input
            id="carNumber"
            name="carNumber"
            value={formData.carNumber}
            onChange={handleChange}
            placeholder="ABC123"
          />
          {errors.carNumber && <p className="text-sm text-red-500">{errors.carNumber}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Input
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="Toyota"
          />
          {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Camry"
          />
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="2023"
          />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Color *</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Black"
          />
          {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select 
            value={formData.fuelType} 
            onValueChange={(value) => handleSelectChange('fuelType', value as FuelType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Vehicle Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value as VehicleType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pricePerDay">Price Per Day ($) *</Label>
          <Input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            value={formData.pricePerDay}
            onChange={handleChange}
            placeholder="0"
            step="0.01"
          />
          {errors.pricePerDay && <p className="text-sm text-red-500">{errors.pricePerDay}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {initialData ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default VehicleForm;
