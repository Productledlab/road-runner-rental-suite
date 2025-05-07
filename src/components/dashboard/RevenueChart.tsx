
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBookings } from '@/lib/storage-service';

interface RevenueChartProps {
  branchId?: string;
}

const RevenueChart = ({ branchId }: RevenueChartProps) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  
  useEffect(() => {
    generateChartData(branchId);
  }, [branchId]);
  
  const generateChartData = (branchId?: string) => {
    const bookings = getBookings(branchId);
    
    // Generate weekly data
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyRevenue = daysOfWeek.map(day => ({ day, revenue: 0 }));
    
    // Generate monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = months.map(month => ({ month, revenue: 0 }));
    
    bookings.forEach((booking: any) => {
      // Count revenue for all bookings regardless of status
      // since payments are made in advance
      const creationDate = new Date(booking.createdAt);
      const dayOfWeek = daysOfWeek[creationDate.getDay()];
      const month = months[creationDate.getMonth()];
      
      // Update weekly revenue
      const weekDayIndex = weeklyRevenue.findIndex(item => item.day === dayOfWeek);
      if (weekDayIndex !== -1) {
        weeklyRevenue[weekDayIndex].revenue += booking.totalPrice;
      }
      
      // Update monthly revenue
      const monthIndex = monthlyRevenue.findIndex(item => item.month === month);
      if (monthIndex !== -1) {
        monthlyRevenue[monthIndex].revenue += booking.totalPrice;
      }
    });
    
    // Reorder weekly data starting from Monday
    const orderedWeeklyData = [
      weeklyRevenue[1], // Mon
      weeklyRevenue[2], // Tue
      weeklyRevenue[3], // Wed
      weeklyRevenue[4], // Thu
      weeklyRevenue[5], // Fri
      weeklyRevenue[6], // Sat
      weeklyRevenue[0], // Sun
    ];
    
    setWeeklyData(orderedWeeklyData);
    setMonthlyData(monthlyRevenue);
  };
  
  const data = period === 'weekly' ? weeklyData : monthlyData;
  const xKey = period === 'weekly' ? 'day' : 'month';
  
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
        <Tabs defaultValue="weekly" onValueChange={(value) => setPeriod(value as 'weekly' | 'monthly')}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} OMR`, 'Revenue']}
                labelFormatter={(label) => `${period === 'weekly' ? 'Day' : 'Month'}: ${label}`}
              />
              <Bar dataKey="revenue" fill="#0F52BA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
