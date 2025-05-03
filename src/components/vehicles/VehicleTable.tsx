
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Vehicle, VehicleStatus, VehicleType, FuelType } from '@/lib/types';
import { Edit, Archive } from 'lucide-react';
import VehicleForm from './VehicleForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getVehicles, saveVehicle, archiveVehicle } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  available: 'bg-green-100 text-green-800',
  booked: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-amber-100 text-amber-800',
  archived: 'bg-gray-100 text-gray-800',
};

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load vehicles from local storage
    const loadedVehicles = getVehicles();
    setVehicles(loadedVehicles);
    setFilteredVehicles(loadedVehicles);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, selectedStatus, selectedType);
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    applyFilters(searchTerm, value, selectedType);
  };

  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
    applyFilters(searchTerm, selectedStatus, value);
  };

  const applyFilters = (term: string, status: string, type: string) => {
    let filtered = [...vehicles];

    if (term) {
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(term) || 
        vehicle.model.toLowerCase().includes(term) ||
        vehicle.carNumber.toLowerCase().includes(term)
      );
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === status);
    }

    if (type && type !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === type);
    }

    setFilteredVehicles(filtered);
  };

  const handleArchive = (vehicleId: string) => {
    archiveVehicle(vehicleId);
    
    // Update local state
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, status: 'archived' as VehicleStatus } 
        : vehicle
    );
    
    setVehicles(updatedVehicles);
    // Apply current filters to the updated list
    applyFilters(searchTerm, selectedStatus, selectedType);
    
    toast({
      title: "Vehicle archived",
      description: "The vehicle has been moved to the archive."
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleVehicleUpdate = (updatedVehicle: Vehicle) => {
    // Save to local storage
    saveVehicle(updatedVehicle);
    
    // Update local state
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    );
    
    setVehicles(updatedVehicles);
    setFilteredVehicles(updatedVehicles);
    setIsDialogOpen(false);
    
    toast({
      title: "Vehicle updated",
      description: "Vehicle information has been updated successfully."
    });
  };

  const statusOptions: VehicleStatus[] = ['available', 'booked', 'maintenance'];
  const typeOptions: VehicleType[] = ['sedan', 'suv', 'hatchback', 'luxury', 'van'];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={selectedStatus} onValueChange={handleStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={selectedType} onValueChange={handleTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {typeOptions.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Car Number</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map(vehicle => (
              <TableRow key={vehicle.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{vehicle.carNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {vehicle.image ? (
                      <img 
                        src={vehicle.image} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : null}
                    <span>{vehicle.make} {vehicle.model}</span>
                  </div>
                </TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>
                  {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                </TableCell>
                <TableCell>
                  {vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}
                </TableCell>
                <TableCell>
                  <Badge className={(statusColors as any)[vehicle.status]}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.pricePerDay} OMR/day</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleArchive(vehicle.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredVehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <VehicleForm 
            initialData={editingVehicle}
            onSubmit={handleVehicleUpdate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleTable;
