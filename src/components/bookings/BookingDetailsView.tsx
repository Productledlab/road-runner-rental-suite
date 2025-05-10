
import { format } from 'date-fns';
import { Booking } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCustomers, getVehicles } from '@/lib/storage-service';

interface BookingDetailsViewProps {
  booking: Booking;
}

const BookingDetailsView = ({ booking }: BookingDetailsViewProps) => {
  const { t } = useLanguage();
  const customers = getCustomers();
  const vehicles = getVehicles();
  
  const customer = customers.find(c => c.id === booking.customerId);
  const vehicle = vehicles.find(v => v.id === booking.vehicleId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">{t('customer')}</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p><span className="text-gray-500">{t('name')}:</span> {customer?.name || 'Unknown'}</p>
            <p><span className="text-gray-500">{t('email')}:</span> {customer?.email || 'Unknown'}</p>
            <p><span className="text-gray-500">{t('phone')}:</span> {customer?.phone || 'Unknown'}</p>
            <p><span className="text-gray-500">{t('passport')}:</span> {customer?.passport || 'Unknown'}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">{t('vehicle')}</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p><span className="text-gray-500">{t('make')}:</span> {vehicle?.make || 'Unknown'}</p>
            <p><span className="text-gray-500">{t('model')}:</span> {vehicle?.model || 'Unknown'}</p>
            <p><span className="text-gray-500">{t('year')}:</span> {vehicle?.year || 'Unknown'}</p>
            <p><span className="text-gray-500">{t('carNumber')}:</span> {vehicle?.carNumber || 'Unknown'}</p>
          </div>
        </div>
        
        <div className="sm:col-span-2">
          <h3 className="font-medium mb-2">{t('bookingDetails')}</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><span className="text-gray-500">{t('startDate')}:</span> {format(new Date(booking.startDate), 'PPP')}</p>
              <p><span className="text-gray-500">{t('endDate')}:</span> {format(new Date(booking.endDate), 'PPP')}</p>
              <p><span className="text-gray-500">{t('status')}:</span> {t(booking.status)}</p>
              <p><span className="text-gray-500">{t('totalPrice')}:</span> {booking.totalPrice} {t('currency')}</p>
              <p><span className="text-gray-500">{t('startKm')}:</span> {booking.startKm || '-'}</p>
              <p><span className="text-gray-500">{t('returnKm')}:</span> {booking.endKm || '-'}</p>
              <p><span className="text-gray-500">{t('kmDriven')}:</span> {booking.kmDriven ? `${booking.kmDriven} km` : '-'}</p>
              <p><span className="text-gray-500">{t('createdAt')}:</span> {format(new Date(booking.createdAt), 'PPP')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;
