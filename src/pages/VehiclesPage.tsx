
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

const VehiclesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

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
      title: "Vehicle added",
      description: `${vehicle.make} ${vehicle.model} has been added successfully.`,
    });
    setIsDialogOpen(false);
    
    // No need to reload the page anymore
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Vehicles</h1>
          <div className="flex items-center gap-4">
            <BranchSelector onChange={handleBranchChange} />
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-rental-600 hover:bg-rental-700 text-white"
            >
              Add New Vehicle
            </Button>
          </div>
        </div>
        
        <VehicleTable branchId={selectedBranch === 'all' ? undefined : selectedBranch || undefined} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <VehicleForm 
            initialData={null}
            onSubmit={handleAddVehicle}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default VehiclesPage;
