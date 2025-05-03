
import AppLayout from "@/components/layout/AppLayout";
import VehicleTable from "@/components/vehicles/VehicleTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VehicleForm from "@/components/vehicles/VehicleForm";
import { Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const VehiclesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddVehicle = (vehicle: Vehicle) => {
    // In a real app, this would make an API call
    toast({
      title: "Vehicle added",
      description: `${vehicle.make} ${vehicle.model} has been added successfully.`,
    });
    setIsDialogOpen(false);
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
