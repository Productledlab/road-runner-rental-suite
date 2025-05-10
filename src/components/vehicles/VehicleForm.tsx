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
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleFormProps {
  initialData: Vehicle | null;
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
  userRole?: string;
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

const VehicleForm = ({ initialData, onSubmit, onCancel, userRole }: VehicleFormProps) => {
  const [formData, setFormData] = useState<Vehicle>(initialData || defaultVehicle);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [newMake, setNewMake] = useState<string>('');
  const [newModel, setNewModel] = useState<string>('');
  const [currentTab, setCurrentTab] = useState('general');
  const { t } = useLanguage();
  
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
  
  const handleRemoveImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = '';
    setImageUrls(newImageUrls);
    
    const newImages = [...images];
    newImages[index] = null as unknown as File;
    setImages(newImages);
    
    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      newImages[index] = '';
      return {
        ...prev,
        images: newImages.filter(Boolean)
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // If branch user is only editing currentKm, only validate that field
    const isBranchUserEditingKmOnly = userRole === 'branch-manager' || userRole === 'staff';
    
    if (isBranchUserEditingKmOnly) {
      if (formData.currentKm < 0) newErrors.currentKm = 'Current km reading cannot be negative';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    // Otherwise, validate all fields for admin
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

  // Determine if the current user is a branch user
  const isBranchUser = userRole === 'branch-manager' || userRole === 'staff';
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {isBranchUser 
            ? t('updateVehicleKm') 
            : initialData ? t('edit') + ' ' + t('vehicle') : t('addNewVehicle')
          }
        </DialogTitle>
        <DialogDescription>
          {isBranchUser 
            ? t('updateVehicleKmDesc') 
            : initialData ? t('vehicleUpdatedDesc') : t('enterBookingDetails')
          }
        </DialogDescription>
      </DialogHeader>
      
      {isBranchUser ? (
        // Simplified form for branch users - only allow editing current km
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentKm">{t('currentKm')} *</Label>
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
          
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm">{t('vehicleDetails')}:</p>
            <p className="text-sm font-medium">{formData.make} {formData.model} ({formData.carNumber})</p>
            <p className="text-sm text-gray-500">{t('year')}: {formData.year}, {t('color')}: {formData.color}</p>
          </div>
        </div>
      ) : (
        // Full form for admin users
        <Tabs defaultValue="general" onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">{t('general')}</TabsTrigger>
            <TabsTrigger value="specifications">{t('specifications')}</TabsTrigger>
            <TabsTrigger value="images">{t('images')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carNumber">{t('carNumber')} *</Label>
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
                <Label htmlFor="status">{t('status')}</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">{t('available')}</SelectItem>
                    <SelectItem value="booked">{t('booked')}</SelectItem>
                    <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="make">{t('make')} *</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-4">
                    <Select 
                      value={formData.make} 
                      onValueChange={(value) => handleSelectChange('make', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectVehicle')} />
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
                    {t('add')}
                  </Button>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="new-make">
                    <AccordionTrigger id="newMakeAccordion" className="text-xs">{t('add')} {t('make')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex space-x-2">
                        <Input
                          value={newMake}
                          onChange={e => setNewMake(e.target.value)}
                          placeholder={t('enterNewMake')}
                        />
                        <Button type="button" onClick={handleAddNewMake}>{t('add')}</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">{t('model')} *</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-4">
                    <Select 
                      value={formData.model} 
                      onValueChange={(value) => handleSelectChange('model', value)}
                      disabled={!formData.make}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.make ? t('selectVehicle') : t('selectDatesFirst')} />
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
                    {t('add')}
                  </Button>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="new-model">
                    <AccordionTrigger id="newModelAccordion" className="text-xs">{t('add')} {t('model')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex space-x-2">
                        <Input
                          value={newModel}
                          onChange={e => setNewModel(e.target.value)}
                          placeholder={t('enterNewModel')}
                          disabled={!formData.make}
                        />
                        <Button type="button" onClick={handleAddNewModel} disabled={!formData.make}>{t('add')}</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentKm">{t('currentKm')} *</Label>
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
                <Label htmlFor="pricePerDay">{t('pricePerDay')} *</Label>
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
                <Label htmlFor="year">{t('year')} *</Label>
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
                <Label htmlFor="color">{t('color')} *</Label>
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
                <Label htmlFor="fuelType">{t('fuelType')}</Label>
                <Select 
                  value={formData.fuelType} 
                  onValueChange={(value) => handleSelectChange('fuelType', value as FuelType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">{t('petrol')}</SelectItem>
                    <SelectItem value="diesel">{t('diesel')}</SelectItem>
                    <SelectItem value="electric">{t('electric')}</SelectItem>
                    <SelectItem value="hybrid">{t('hybrid')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">{t('type')}</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value as VehicleType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">{t('sedan')}</SelectItem>
                    <SelectItem value="suv">{t('suv')}</SelectItem>
                    <SelectItem value="hatchback">{t('hatchback')}</SelectItem>
                    <SelectItem value="luxury">{t('luxury')}</SelectItem>
                    <SelectItem value="van">{t('van')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {imageTypes.map((type, index) => (
                <div key={type} className="space-y-2">
                  <Label htmlFor={`image-${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)} {t('view')}</Label>
                  <div className="flex flex-col space-y-2">
                    {imageUrls[index] ? (
                      <div className="relative w-full h-40 border rounded overflow-hidden">
                        <img 
                          src={imageUrls[index]} 
                          alt={`${type} view`} 
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          type="button"
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-40 border rounded flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400">{t('noImage')}</span>
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
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" className="bg-rental-600 hover:bg-rental-700 text-white">
          {isBranchUser 
            ? t('update') + ' ' + t('km') 
            : initialData ? t('update') + ' ' + t('vehicle') : t('addNewVehicle')
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

export default VehicleForm;
