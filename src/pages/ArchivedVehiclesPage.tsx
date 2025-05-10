
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from "@/components/layout/AppLayout";
import ArchivedVehiclesTable from "@/components/vehicles/ArchivedVehiclesTable";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArchivedBookingsTable from "@/components/bookings/ArchivedBookingsTable";
import ArchivedCustomersTable from "@/components/customers/ArchivedCustomersTable";

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
        <h1 className="page-title">{t('archivedItems')}</h1>
        <p className="text-gray-500">
          {t('archivedItemsDesc')}
        </p>
        
        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList>
            <TabsTrigger value="vehicles">{t('vehicles')}</TabsTrigger>
            <TabsTrigger value="bookings">{t('bookings')}</TabsTrigger>
            <TabsTrigger value="customers">{t('customers')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicles" className="mt-6">
            <ArchivedVehiclesTable />
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-6">
            <ArchivedBookingsTable />
          </TabsContent>
          
          <TabsContent value="customers" className="mt-6">
            <ArchivedCustomersTable />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ArchivedVehiclesPage;
