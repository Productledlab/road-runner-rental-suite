
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const weeklyData = [
  { day: 'Mon', revenue: 1200 },
  { day: 'Tue', revenue: 1900 },
  { day: 'Wed', revenue: 2100 },
  { day: 'Thu', revenue: 1500 },
  { day: 'Fri', revenue: 2300 },
  { day: 'Sat', revenue: 2800 },
  { day: 'Sun', revenue: 2400 },
];

const monthlyData = [
  { month: 'Jan', revenue: 15000 },
  { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 22000 },
  { month: 'Apr', revenue: 19500 },
  { month: 'May', revenue: 23000 },
  { month: 'Jun', revenue: 26000 },
];

const RevenueChart = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  
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
