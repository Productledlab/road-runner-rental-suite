
import { useState, useEffect } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import StatusChart from '@/components/dashboard/StatusChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentBookingsTable from '@/components/dashboard/RecentBookingsTable';
import AppLayout from '@/components/layout/AppLayout';
import { 
  CarFront, 
  CalendarDays,
  Users,
  DollarSign
} from 'lucide-react';
import { getVehicles, getBookings, getCustomers, getActiveBookings } from '@/lib/storage-service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  useEffect(() => {
    // Load data from local storage
    setVehicles(getVehicles());
    setBookings(getBookings());
    setCustomers(getCustomers());
  }, []);
  
  // Calculate metrics
  const totalVehicles = vehicles.filter((v: any) => v.status !== 'archived').length;
  const availableVehicles = vehicles.filter((v: any) => v.status === 'available').length;
  const totalCustomers = customers.length;
  const activeBookings = bookings.filter((b: any) => b.status === 'ongoing').length;
  
  // Calculate revenue
  const totalRevenue = bookings
    .filter((b: any) => b.status === 'completed')
    .reduce((sum: number, booking: any) => sum + booking.totalPrice, 0);

  // Active bookings details for popup
  const activeBookingsList = getActiveBookings();
  const activeBookingsDetails = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeBookingsList.map((booking: any) => {
          const customer = customers.find((c: any) => c.id === booking.customerId);
          const vehicle = vehicles.find((v: any) => v.id === booking.vehicleId);
          
          return (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{customer?.name || 'Unknown'}</TableCell>
              <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</TableCell>
              <TableCell>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{format(new Date(booking.endDate), 'MMM dd, yyyy')}</TableCell>
            </TableRow>
          );
        })}
        {activeBookingsList.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">No active bookings</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // Available vehicles details for popup
  const availableVehiclesList = vehicles.filter((v: any) => v.status === 'available');
  const availableVehiclesDetails = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle</TableHead>
          <TableHead>Car Number</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price/Day</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {availableVehiclesList.map((vehicle: any) => (
          <TableRow key={vehicle.id}>
            <TableCell className="font-medium">{vehicle.make} {vehicle.model}</TableCell>
            <TableCell>{vehicle.carNumber}</TableCell>
            <TableCell>{vehicle.type}</TableCell>
            <TableCell>{vehicle.pricePerDay} OMR</TableCell>
          </TableRow>
        ))}
        {availableVehiclesList.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">No available vehicles</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // All customers list for popup
  const customersDetails = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.slice(0, 5).map((customer: any) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
          </TableRow>
        ))}
        {customers.length > 5 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-sm text-gray-500">
              And {customers.length - 5} more...
            </TableCell>
          </TableRow>
        )}
        {customers.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center">No customers</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // Revenue details for popup
  const completedBookings = bookings.filter((b: any) => b.status === 'completed');
  const revenueDetails = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedBookings.slice(0, 5).map((booking: any) => {
          const customer = customers.find((c: any) => c.id === booking.customerId);
          const vehicle = vehicles.find((v: any) => v.id === booking.vehicleId);
          
          return (
            <TableRow key={booking.id}>
              <TableCell className="font-mono text-sm">{booking.id}</TableCell>
              <TableCell>{customer?.name || 'Unknown'}</TableCell>
              <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</TableCell>
              <TableCell>{booking.totalPrice} OMR</TableCell>
            </TableRow>
          );
        })}
        {completedBookings.length > 5 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-sm text-gray-500">
              And {completedBookings.length - 5} more...
            </TableCell>
          </TableRow>
        )}
        {completedBookings.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">No completed bookings</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="page-title">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Active Vehicles"
            value={totalVehicles}
            icon={<CarFront className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
            details={availableVehiclesDetails}
          />
          
          <StatCard 
            title="Available Vehicles"
            value={availableVehicles}
            icon={<CarFront className="h-5 w-5" />}
            color="green"
            details={availableVehiclesDetails}
          />
          
          <StatCard 
            title="Active Bookings"
            value={activeBookings}
            icon={<CalendarDays className="h-5 w-5" />}
            color="amber"
            details={activeBookingsDetails}
          />
          
          <StatCard 
            title="Total Revenue"
            value={`${totalRevenue} OMR`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
            color="purple"
            details={revenueDetails}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatusChart vehicles={vehicles} />
          <RevenueChart />
        </div>
        
        <RecentBookingsTable />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
