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
import { Edit, Archive, Eye, Calendar } from 'lucide-react';
import VehicleForm from './VehicleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getVehicles, saveVehicle, archiveVehicle, saveBooking } from '@/lib/storage-service';
import { useToast } from '@/hooks/use-toast';
import VehicleDetails from './VehicleDetails';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingForm from '../bookings/BookingForm';
import { Label } from '@/components/ui/label';

interface VehicleTableProps {
  branchId?: string;
  userRole?: string;
}

const statusColors = {
  available: 'bg-green-100 text-green-800',
  booked: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-amber-100 text-amber-800',
  archived: 'bg-gray-100 text-gray-800',
};

const VehicleTable = ({ branchId, userRole = '' }: VehicleTableProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  
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

    // Hide archived vehicles for branch users
    if (userRole !== 'admin') {
      filtered = filtered.filter(vehicle => vehicle.status !== 'archived');
    }

    setFilteredVehicles(filtered);
  };

  const handleArchive = (vehicleId: string) => {
    // Only admin can archive vehicles
    if (userRole !== 'admin') {
      toast({
        title: t('accessDenied'),
        description: t('onlyAdminCanArchiveVehicles'),
        variant: 'destructive'
      });
      return;
    }

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
      title: t('vehicleArchived'),
      description: t('vehicleArchivedDesc')
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };
  
  const handleView = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle);
    setIsViewDialogOpen(true);
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
      title: t('vehicleUpdated'),
      description: t('vehicleUpdatedDesc')
    });
  };

  const handleCreateBooking = (vehicle: Vehicle) => {
    if (vehicle.status !== 'available') {
      toast({
        title: t('vehicleNotAvailable'),
        description: t('cannotCreateBookingForUnavailableVehicle'),
        variant: 'destructive'
      });
      return;
    }

    setSelectedVehicleForBooking(vehicle);
    setIsBookingDialogOpen(true);
  };

  const handleBookingCreated = (newBooking: any) => {
    // Save the booking to storage
    saveBooking(newBooking);
    
    // Mark the vehicle as booked
    const updatedVehicle = vehicles.find(v => v.id === newBooking.vehicleId);
    if (updatedVehicle) {
      updatedVehicle.status = 'booked' as VehicleStatus;
      saveVehicle(updatedVehicle);
    }
    
    // Close dialog
    setIsBookingDialogOpen(false);
    
    // Show notification
    toast({
      title: t('bookingCreated'),
      description: t('bookingCreatedSuccessfully'),
    });
    
    // Refresh the vehicle list
    const updatedVehicles = getVehicles();
    setVehicles(updatedVehicles);
    
    // Apply current filters to the updated list
    applyFilters(searchTerm, selectedStatus, selectedType);
    
    // Redirect to bookings page after a short delay
    setTimeout(() => {
      window.location.href = '/bookings';
    }, 1500);
  };

  const statusOptions: VehicleStatus[] = ['available', 'booked', 'maintenance'];
  const typeOptions: VehicleType[] = ['sedan', 'suv', 'hatchback', 'luxury', 'van'];

  // Determine if current user can edit vehicle data
  const canManageVehicles = userRole === 'admin';

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder={t('searchVehicles')}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={selectedStatus} onValueChange={handleStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {t(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={selectedType} onValueChange={handleTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              {typeOptions.map(type => (
                <SelectItem key={type} value={type}>
                  {t(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>{t('carNumber')}</TableHead>
              <TableHead>{t('vehicle')}</TableHead>
              <TableHead>{t('year')}</TableHead>
              <TableHead>{t('color')}</TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('fuelType')}</TableHead>
              <TableHead>{t('currentKm')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('pricePerDay')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map(vehicle => (
              <TableRow key={vehicle.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{vehicle.carNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img 
                        src={vehicle.images[0]} 
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
                  {t(vehicle.type)}
                </TableCell>
                <TableCell>
                  {t(vehicle.fuelType)}
                </TableCell>
                <TableCell>{vehicle.currentKm || 0}</TableCell>
                <TableCell>
                  <Badge className={(statusColors as any)[vehicle.status]}>
                    {t(vehicle.status)}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.pricePerDay} {t('currency')}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleView(vehicle)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {vehicle.status === 'available' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCreateBooking(vehicle)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">{t('book')}</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {canManageVehicles && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleArchive(vehicle.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredVehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  {t('noVehiclesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('editVehicle')}</DialogTitle>
          </DialogHeader>
          <VehicleForm 
            initialData={editingVehicle}
            onSubmit={handleVehicleUpdate}
            onCancel={() => setIsDialogOpen(false)}
            userRole={userRole}
          />
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('vehicleDetails')}</DialogTitle>
          </DialogHeader>
          {viewingVehicle && <VehicleDetails vehicle={viewingVehicle} />}
        </DialogContent>
      </Dialog>

      {/* Booking dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('createBooking')}</DialogTitle>
            <DialogDescription>
              {t('createBookingForVehicle', { vehicle: selectedVehicleForBooking ? `${selectedVehicleForBooking.make} ${selectedVehicleForBooking.model}` : '' })}
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleForBooking && (
            <BookingForm 
              initialData={null}
              onSubmit={handleBookingCreated}
              onCancel={() => setIsBookingDialogOpen(false)}
              preselectedVehicleId={selectedVehicleForBooking.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleTable;
