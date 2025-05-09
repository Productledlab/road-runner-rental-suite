
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/lib/types";
import { format } from "date-fns";
import { getBookings, getCustomers, getVehicles } from '@/lib/storage-service';
import { useLanguage } from '@/contexts/LanguageContext';

const getBadgeColorForStatus = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'ongoing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface RecentBookingsTableProps {
  branchId?: string;
}

const RecentBookingsTable = ({ branchId }: RecentBookingsTableProps) => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Get most recent 5 bookings from local storage for the selected branch
    const bookings = getBookings(branchId);
    const sortedBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
      
    setRecentBookings(sortedBookings);
    setCustomers(getCustomers(branchId));
    setVehicles(getVehicles());
  }, [branchId]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{t('recentBookings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>{t('bookingId')}</TableHead>
              <TableHead>{t('customer')}</TableHead>
              <TableHead>{t('vehicle')}</TableHead>
              <TableHead>{t('startDate')}</TableHead>
              <TableHead>{t('endDate')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('totalPrice')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings.map((booking) => {
              const customer = customers.find((c: any) => c.id === booking.customerId);
              const vehicle = vehicles.find((v: any) => v.id === booking.vehicleId);
              
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs">{booking.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium">{customer?.name || 'Unknown'}</TableCell>
                  <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</TableCell>
                  <TableCell>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(booking.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColorForStatus(booking.status)}>
                      {t(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{booking.totalPrice} {t('currency')}</TableCell>
                </TableRow>
              );
            })}
            {recentBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-12 text-center">{t('noBookingsFound')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentBookingsTable;
