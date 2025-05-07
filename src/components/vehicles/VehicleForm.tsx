
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
import { DialogTitle, DialogHeader, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getCurrentBranch, getUniqueMakes, getUniqueModels } from '@/lib/storage-service';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  currentKm: 0,
  images: []
};

const VehicleForm = ({ initialData, onSubmit, onCancel }: VehicleFormProps) => {
  const [formData, setFormData] = useState<Vehicle>(initialData || defaultVehicle);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [newMake, setNewMake] = useState<string>('');
  const [newModel, setNewModel] = useState<string>('');
  const [currentTab, setCurrentTab] = useState('general');
  
  // Image handling
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  const [imageTypes, setImageTypes] = useState<string[]>(['front', 'back', 'left', 'right', 'dashboard']);
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImageUrls(initialData.images || []);
    } else {
      // Generate a random ID if creating a new vehicle
      setFormData({
        ...defaultVehicle,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdatedBy: getCurrentBranch()
      });
    }
    
    // Load makes and models
    const availableMakes = getUniqueMakes();
    setMakes(availableMakes);
    
    if (initialData?.make) {
      const availableModels = getUniqueModels(initialData.make);
      setModels(availableModels);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'pricePerDay' || name === 'currentKm' ? Number(value) : value
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
    
    if (name === 'make') {
      // Reset model when make changes
      setFormData(prev => ({
        ...prev,
        model: ''
      }));
      
      // Update available models
      const availableModels = getUniqueModels(value);
      setModels(availableModels);
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleAddNewMake = () => {
    if (newMake.trim() && !makes.includes(newMake)) {
      setMakes(prev => [...prev, newMake]);
      setFormData(prev => ({
        ...prev,
        make: newMake
      }));
      setNewMake('');
    }
  };
  
  const handleAddNewModel = () => {
    if (newModel.trim() && !models.includes(newModel)) {
      setModels(prev => [...prev, newModel]);
      setFormData(prev => ({
        ...prev,
        model: newModel
      }));
      setNewModel('');
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create a temporary URL for the image
      const imageUrl = URL.createObjectURL(files[0]);
      
      // Update the imageUrls array
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = imageUrl;
      setImageUrls(newImageUrls);
      
      // Store the file
      const newImages = [...images];
      newImages[index] = files[0];
      setImages(newImages);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        images: newImageUrls
      }));
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
    if (formData.currentKm < 0) newErrors.currentKm = 'Current km reading cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Make sure we have the current branch set
      const updatedVehicle = {
        ...formData,
        lastUpdatedBy: getCurrentBranch()
      };
      
      onSubmit(updatedVehicle);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        <DialogDescription>
          {initialData ? 'Update vehicle information' : 'Enter details for the new vehicle'}
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="general" onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
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
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-4">
                  <Select 
                    value={formData.make} 
                    onValueChange={(value) => handleSelectChange('make', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a make" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('newMakeAccordion')?.click()}
                  className="col-span-1"
                >
                  Add
                </Button>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="new-make">
                  <AccordionTrigger id="newMakeAccordion" className="text-xs">Add New Make</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex space-x-2">
                      <Input
                        value={newMake}
                        onChange={e => setNewMake(e.target.value)}
                        placeholder="Enter new make"
                      />
                      <Button type="button" onClick={handleAddNewMake}>Add</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-4">
                  <Select 
                    value={formData.model} 
                    onValueChange={(value) => handleSelectChange('model', value)}
                    disabled={!formData.make}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.make ? "Select a model" : "Select make first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('newModelAccordion')?.click()}
                  className="col-span-1"
                  disabled={!formData.make}
                >
                  Add
                </Button>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="new-model">
                  <AccordionTrigger id="newModelAccordion" className="text-xs">Add New Model</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex space-x-2">
                      <Input
                        value={newModel}
                        onChange={e => setNewModel(e.target.value)}
                        placeholder="Enter new model"
                        disabled={!formData.make}
                      />
                      <Button type="button" onClick={handleAddNewModel} disabled={!formData.make}>Add</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentKm">Current KM Reading *</Label>
              <Input
                id="currentKm"
                name="currentKm"
                type="number"
                value={formData.currentKm}
                onChange={handleChange}
                placeholder="0"
              />
              {errors.currentKm && <p className="text-sm text-red-500">{errors.currentKm}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price Per Day (OMR) *</Label>
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
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {imageTypes.map((type, index) => (
              <div key={type} className="space-y-2">
                <Label htmlFor={`image-${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)} View</Label>
                <div className="flex flex-col space-y-2">
                  {imageUrls[index] && (
                    <div className="relative w-full h-40 border rounded overflow-hidden">
                      <img 
                        src={imageUrls[index]} 
                        alt={`${type} view`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id={`image-${type}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
