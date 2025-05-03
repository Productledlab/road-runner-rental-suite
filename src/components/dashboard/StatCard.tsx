
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const StatCard = ({ title, value, icon, trend, color = 'blue' }: StatCardProps) => {
  const getColorClass = () => {
    switch (color) {
      case 'green': return 'bg-green-50 text-green-700';
      case 'amber': return 'bg-amber-50 text-amber-700';
      case 'red': return 'bg-red-50 text-red-700';
      case 'purple': return 'bg-purple-50 text-purple-700';
      default: return 'bg-rental-50 text-rental-700';
    }
  };

  return (
    <div className="dashboard-card flex items-start space-x-4">
      <div className={`p-3 rounded-full ${getColorClass()}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="stat-label">{title}</h3>
        <div className="stat-value">{value}</div>
        {trend && (
          <p className={`text-sm mt-1 flex items-center ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`mr-1 ${trend.isPositive ? '↑' : '↓'}`}>
              {trend.isPositive ? '↑' : '↓'}
            </span>
            {trend.value}% from last period
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
