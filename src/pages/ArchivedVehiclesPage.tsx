
import AppLayout from "@/components/layout/AppLayout";
import ArchivedVehiclesTable from "@/components/vehicles/ArchivedVehiclesTable";
import { useLanguage } from '@/contexts/LanguageContext';

const ArchivedVehiclesPage = () => {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="page-title">{t('archivedVehicles')}</h1>
        <p className="text-gray-500">
          This page shows vehicles that have been archived and are no longer active in the fleet.
        </p>
        
        <ArchivedVehiclesTable />
      </div>
    </AppLayout>
  );
};

export default ArchivedVehiclesPage;
