
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import VehicleTable from "@/components/vehicles/VehicleTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VehicleForm from "@/components/vehicles/VehicleForm";
import { Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { saveVehicle } from "@/lib/storage-service";
import BranchSelector from "@/components/layout/BranchSelector";
import { useLanguage } from '@/contexts/LanguageContext';

const VehiclesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Get user information
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserRole(user.role);
        
        // If branch manager, use their assigned branch
        if (user.role === 'branch-manager' && user.branchAccess) {
          setSelectedBranch(user.branchAccess);
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleAddVehicle = (vehicle: Vehicle) => {
    // Save to local storage
    saveVehicle(vehicle);
    
    toast({
      title: `${t('addNewVehicle')}`,
      description: `${vehicle.make} ${vehicle.model} has been added successfully.`,
    });
    setIsDialogOpen(false);
    
    // Reload the page to refresh the vehicle list
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  // Only allow admin to add new vehicles
  const showAddButton = userRole === 'admin';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">{t('vehicles')}</h1>
          <div className="flex items-center gap-4">
            <BranchSelector onChange={handleBranchChange} />
            {showAddButton && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-rental-600 hover:bg-rental-700 text-white"
              >
                {t('addNewVehicle')}
              </Button>
            )}
          </div>
        </div>
        
        <VehicleTable 
          branchId={selectedBranch === 'all' ? undefined : selectedBranch || undefined} 
          userRole={userRole || ''}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <VehicleForm 
            initialData={null}
            onSubmit={handleAddVehicle}
            onCancel={() => setIsDialogOpen(false)}
            userRole={userRole || ''}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default VehiclesPage;
