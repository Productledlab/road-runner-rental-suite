
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/lib/types";
import { format } from "date-fns";
import { getBookings, getCustomers, getVehicles } from '@/lib/storage-service';

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

const RecentBookingsTable = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  
  useEffect(() => {
    // Get most recent 5 bookings from local storage
    const bookings = getBookings();
    const sortedBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
      
    setRecentBookings(sortedBookings);
    setCustomers(getCustomers());
    setVehicles(getVehicles());
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings.map((booking) => {
              const customer = customers.find((c: any) => c.id === booking.customerId);
              const vehicle = vehicles.find((v: any) => v.id === booking.vehicleId);
              
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{customer?.name || 'Unknown'}</TableCell>
                  <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</TableCell>
                  <TableCell>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(booking.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColorForStatus(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{booking.totalPrice} OMR</TableCell>
                </TableRow>
              );
            })}
            {recentBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-12 text-center">No bookings found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentBookingsTable;
