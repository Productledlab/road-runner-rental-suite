
import { useState, useEffect } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import StatusChart from '@/components/dashboard/StatusChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentBookingsTable from '@/components/dashboard/RecentBookingsTable';
import AppLayout from '@/components/layout/AppLayout';
import BranchSelector from '@/components/layout/BranchSelector';
import { 
  CarFront, 
  CalendarDays,
  Users,
  DollarSign
} from 'lucide-react';
import { getVehicles, getBookings, getCustomers, getActiveBookings, getDashboardStats } from '@/lib/storage-service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeBookings: 0,
    totalRevenue: 0,
    customers: 0
  });
  
  useEffect(() => {
    // Load data from local storage
    setVehicles(getVehicles());
    loadBranchData(selectedBranch);
  }, [selectedBranch]);
  
  const loadBranchData = (branchId: string | null) => {
    setBookings(getBookings(branchId === 'all' ? undefined : branchId || undefined));
    setCustomers(getCustomers(branchId === 'all' ? undefined : branchId || undefined));
    
    const dashboardStats = getDashboardStats(branchId === 'all' ? undefined : branchId || undefined);
    setStats(dashboardStats);
  };
  
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };
  
  // Active bookings details for popup
  const activeBookingsList = getActiveBookings(selectedBranch === 'all' ? undefined : selectedBranch || undefined);
  const activeBookingsDetails = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Branch</TableHead>
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
              <TableCell>{booking.branchId}</TableCell>
            </TableRow>
          );
        })}
        {activeBookingsList.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">No active bookings</TableCell>
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
          <TableHead>Type</TableHead>
          <TableHead>Branch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.slice(0, 5).map((customer: any) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>
              <Badge className={customer.type === 'new' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                {customer.type}
              </Badge>
            </TableCell>
            <TableCell>{customer.branchId}</TableCell>
          </TableRow>
        ))}
        {customers.length > 5 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-sm text-gray-500">
              And {customers.length - 5} more...
            </TableCell>
          </TableRow>
        )}
        {customers.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">No customers</TableCell>
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
          <TableHead>Branch</TableHead>
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
              <TableCell>{booking.branchId}</TableCell>
            </TableRow>
          );
        })}
        {completedBookings.length > 5 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-sm text-gray-500">
              And {completedBookings.length - 5} more...
            </TableCell>
          </TableRow>
        )}
        {completedBookings.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">No completed bookings</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Dashboard</h1>
          <BranchSelector showAllOption={true} onChange={handleBranchChange} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Active Vehicles"
            value={stats.totalVehicles}
            icon={<CarFront className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
            details={availableVehiclesDetails}
          />
          
          <StatCard 
            title="Available Vehicles"
            value={stats.availableVehicles}
            icon={<CarFront className="h-5 w-5" />}
            color="green"
            details={availableVehiclesDetails}
          />
          
          <StatCard 
            title="Active Bookings"
            value={stats.activeBookings}
            icon={<CalendarDays className="h-5 w-5" />}
            color="amber"
            details={activeBookingsDetails}
          />
          
          <StatCard 
            title="Total Revenue"
            value={`${stats.totalRevenue} OMR`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
            color="purple"
            details={revenueDetails}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatusChart vehicles={vehicles} />
          <RevenueChart branchId={selectedBranch === 'all' ? undefined : selectedBranch || undefined} />
        </div>
        
        <RecentBookingsTable branchId={selectedBranch === 'all' ? undefined : selectedBranch || undefined} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
