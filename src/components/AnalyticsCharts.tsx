import { Card } from '@/components/ui/card';
import { Booking, Resource } from '@/types/booking';
import { calculateUtilization, getPeakHours } from '@/utils/bookingUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface AnalyticsChartsProps {
  bookings: Booking[];
  resources: Resource[];
}

export const AnalyticsCharts = ({ bookings, resources }: AnalyticsChartsProps) => {
  const peakHours = getPeakHours(bookings).slice(0, 10);

  const peakHoursData = peakHours.map((ph) => ({
    hour: `${ph.hour}:00`,
    bookings: ph.count,
  }));

  const resourceUtilization = resources.map((resource) => {
    const utilization = calculateUtilization(bookings, resource.id);
    return {
      name: resource.name.length > 15 ? resource.name.substring(0, 15) + '...' : resource.name,
      utilization: parseFloat(utilization.toFixed(1)),
    };
  });

  const typeDistribution = resources.reduce((acc, resource) => {
    const count = bookings.filter(
      (b) => b.resourceId === resource.id && b.status !== 'cancelled'
    ).length;
    const existing = acc.find((item) => item.type === resource.type);
    if (existing) {
      existing.count += count;
    } else {
      acc.push({ type: resource.type, count });
    }
    return acc;
  }, [] as { type: string; count: number }[]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Peak Hours</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="hour" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Resource Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" domain={[0, 100]} className="text-xs" />
              <YAxis dataKey="name" type="category" width={100} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="utilization" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Bookings by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) =>
                  `${type.charAt(0).toUpperCase() + type.slice(1)}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
