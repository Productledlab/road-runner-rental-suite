
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from "@/components/layout/AppLayout";
import ArchivedVehiclesTable from "@/components/vehicles/ArchivedVehiclesTable";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const ArchivedVehiclesPage = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get user role
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserRole(user.role);
        
        // Redirect non-admin users
        if (user.role !== 'admin') {
          toast({
            title: t('accessDenied'),
            description: t('onlyAdminCanAccessArchivedVehicles'),
            variant: 'destructive'
          });
          navigate('/vehicles');
        }
      } catch (e) {
        console.error('Error parsing user data', e);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate, t, toast]);

  // Only render content if user is admin
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="page-title">{t('archivedVehicles')}</h1>
        <p className="text-gray-500">
          {t('archivedVehiclesDesc')}
        </p>
        
        <ArchivedVehiclesTable />
      </div>
    </AppLayout>
  );
};

export default ArchivedVehiclesPage;
