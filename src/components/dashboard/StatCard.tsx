
import { ReactNode, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  onClick?: () => void;
  details?: ReactNode;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue',
  onClick,
  details
}: StatCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const baseColors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const iconColors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  const cardStyle = details || onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : '';
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (details) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Card 
        className={`overflow-hidden ${cardStyle}`} 
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <div className="flex items-baseline">
                <h4 className="text-2xl font-semibold">{value}</h4>
                {trend && (
                  <span className={`ml-2 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.isPositive ? '+' : '-'}{trend.value}%
                  </span>
                )}
              </div>
            </div>

            <div className={`p-2 rounded-full ${iconColors[color]}`}>{icon}</div>
          </div>
        </CardContent>
      </Card>

      {details && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title} Details</DialogTitle>
            </DialogHeader>
            {details}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default StatCard;
