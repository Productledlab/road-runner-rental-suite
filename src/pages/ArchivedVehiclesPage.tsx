
import AppLayout from "@/components/layout/AppLayout";
import ArchivedVehiclesTable from "@/components/vehicles/ArchivedVehiclesTable";

const ArchivedVehiclesPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="page-title">Archived Vehicles</h1>
        <p className="text-gray-500">
          This page shows vehicles that have been archived and are no longer active in the fleet.
        </p>
        
        <ArchivedVehiclesTable />
      </div>
    </AppLayout>
  );
};

export default ArchivedVehiclesPage;
