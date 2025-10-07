import { Card } from '@/components/ui/card';
import { CalendarCheck, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const StatCard = ({ title, value, icon, trend, variant = 'default' }: StatCardProps) => {
  const variantStyles = {
    default: 'border-l-4 border-l-primary',
    success: 'border-l-4 border-l-success',
    warning: 'border-l-4 border-l-warning',
    destructive: 'border-l-4 border-l-destructive',
  };

  return (
    <Card className={`p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className="p-3 bg-secondary rounded-lg">{icon}</div>
      </div>
    </Card>
  );
};

interface DashboardStatsProps {
  totalBookings: number;
  activeBookings: number;
  utilization: number;
  conflicts: number;
}

export const DashboardStats = ({
  totalBookings,
  activeBookings,
  utilization,
  conflicts,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Bookings"
        value={totalBookings}
        icon={<CalendarCheck className="w-6 h-6 text-primary" />}
        trend="+12% from last week"
        variant="default"
      />
      <StatCard
        title="Active Today"
        value={activeBookings}
        icon={<Clock className="w-6 h-6 text-success" />}
        trend="Currently in use"
        variant="success"
      />
      <StatCard
        title="Utilization"
        value={`${utilization.toFixed(0)}%`}
        icon={<TrendingUp className="w-6 h-6 text-primary" />}
        trend="Avg. resource usage"
        variant="default"
      />
      <StatCard
        title="Conflicts Resolved"
        value={conflicts}
        icon={<AlertCircle className="w-6 h-6 text-warning" />}
        trend="Auto-suggested alternatives"
        variant="warning"
      />
    </div>
  );
};
