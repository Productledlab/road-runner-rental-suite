
import { useState } from 'react';
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
import { mockVehicles, mockBookings, mockCustomers } from '@/lib/mock-data';

const Dashboard = () => {
  // Calculate metrics
  const totalVehicles = mockVehicles.filter(v => v.status !== 'archived').length;
  const availableVehicles = mockVehicles.filter(v => v.status === 'available').length;
  const totalCustomers = mockCustomers.length;
  const activeBookings = mockBookings.filter(b => b.status === 'ongoing').length;
  
  // Calculate revenue
  const totalRevenue = mockBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

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
          />
          
          <StatCard 
            title="Available Vehicles"
            value={availableVehicles}
            icon={<CarFront className="h-5 w-5" />}
            color="green"
          />
          
          <StatCard 
            title="Active Bookings"
            value={activeBookings}
            icon={<CalendarDays className="h-5 w-5" />}
            color="amber"
          />
          
          <StatCard 
            title="Total Revenue"
            value={`${totalRevenue} OMR`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
            color="purple"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatusChart vehicles={mockVehicles} />
          <RevenueChart />
        </div>
        
        <RecentBookingsTable />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
