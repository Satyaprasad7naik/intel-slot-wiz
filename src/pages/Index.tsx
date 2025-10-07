import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from '@/components/DashboardStats';
import { ResourceCard } from '@/components/ResourceCard';
import { BookingForm } from '@/components/BookingForm';
import { BookingCalendar } from '@/components/BookingCalendar';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { mockResources, mockBookings } from '@/data/mockData';
import { Booking } from '@/types/booking';
import { calculateUtilization } from '@/utils/bookingUtils';
import { LayoutDashboard, Calendar, TrendingUp, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Index = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string>();

  const handleNewBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `b${bookings.length + 1}`,
      createdAt: new Date(),
    };
    setBookings([...bookings, newBooking]);
    setShowBookingForm(false);
  };

  const handleBookResource = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setShowBookingForm(true);
  };

  const today = new Date();
  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.startTime);
    return (
      bookingDate.toDateString() === today.toDateString() && b.status !== 'cancelled'
    );
  });

  const utilization = calculateUtilization(bookings);
  const conflicts = 3; // Mock value - in real app, calculate from conflict detection

  const isResourceAvailable = (resourceId: string): boolean => {
    const now = new Date();
    return !bookings.some(
      (b) =>
        b.resourceId === resourceId &&
        b.status !== 'cancelled' &&
        b.startTime <= now &&
        b.endTime > now
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Smart Resource Scheduler
              </h1>
              <p className="text-muted-foreground mt-1">
                Intelligent allocation & conflict resolution
              </p>
            </div>
            <Button onClick={() => setShowBookingForm(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Booking
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats
              totalBookings={bookings.length}
              activeBookings={todayBookings.length}
              utilization={utilization}
              conflicts={conflicts}
            />

            <div>
              <h2 className="text-2xl font-bold mb-4">Available Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isAvailable={isResourceAvailable(resource.id)}
                    onBook={handleBookResource}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookingCalendar bookings={bookings} resources={mockResources} />
              <BookingForm
                resources={mockResources}
                bookings={bookings}
                onBookingSubmit={handleNewBooking}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsCharts bookings={bookings} resources={mockResources} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          <BookingForm
            resources={mockResources}
            bookings={bookings}
            selectedResourceId={selectedResourceId}
            onBookingSubmit={handleNewBooking}
            onClose={() => setShowBookingForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
