
import AppLayout from "@/components/layout/AppLayout";
import VehicleTable from "@/components/vehicles/VehicleTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VehicleForm from "@/components/vehicles/VehicleForm";
import { Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { saveVehicle } from "@/lib/storage-service";

const VehiclesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddVehicle = (vehicle: Vehicle) => {
    // Save to local storage
    saveVehicle(vehicle);
    
    toast({
      title: "Vehicle added",
      description: `${vehicle.make} ${vehicle.model} has been added successfully.`,
    });
    setIsDialogOpen(false);
    
    // Force reload the table
    // This is a hacky way to refresh the table - in a real app we would use context or state management
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Vehicles</h1>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-rental-600 hover:bg-rental-700 text-white"
          >
            Add New Vehicle
          </Button>
        </div>
        
        <VehicleTable />
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
