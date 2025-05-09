
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { mockArchivedVehicles } from '@/lib/mock-data';
import { Vehicle } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ArchivedVehiclesTable = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockArchivedVehicles);
  const { t } = useLanguage();

  const handleRestore = (vehicleId: string) => {
    // Implementation would move the vehicle back to active vehicles
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    setVehicles(updatedVehicles);
  };

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>{t('carNumber')}</TableHead>
              <TableHead>{t('vehicle')}</TableHead>
              <TableHead>{t('year')}</TableHead>
              <TableHead>{t('color')}</TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('fuelType')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map(vehicle => (
              <TableRow key={vehicle.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{vehicle.carNumber}</TableCell>
                <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>
                  {t(vehicle.type)}
                </TableCell>
                <TableCell>
                  {t(vehicle.fuelType)}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestore(vehicle.id)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('cancel')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {vehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t('noVehiclesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ArchivedVehiclesTable;
