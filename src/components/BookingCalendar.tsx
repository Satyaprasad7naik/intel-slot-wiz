import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking, Resource } from '@/types/booking';
import { formatTime } from '@/utils/bookingUtils';
import { Clock, User, FileText } from 'lucide-react';

interface BookingCalendarProps {
  bookings: Booking[];
  resources: Resource[];
}

export const BookingCalendar = ({ bookings, resources }: BookingCalendarProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayBookings = bookings
    .filter((b) => {
      const bookingDate = new Date(b.startTime);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime() && b.status !== 'cancelled';
    })
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const getResourceName = (resourceId: string) => {
    return resources.find((r) => r.id === resourceId)?.name || 'Unknown Resource';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Today's Schedule</h2>
      
      {todayBookings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No bookings scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayBookings.map((booking) => (
            <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{getResourceName(booking.resourceId)}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.userName}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{booking.purpose}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
