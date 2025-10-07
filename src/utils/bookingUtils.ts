import { Booking, Resource, ConflictInfo, TimeSlot } from '@/types/booking';

export const checkConflicts = (
  resourceId: string,
  startTime: Date,
  endTime: Date,
  bookings: Booking[],
  resources: Resource[]
): ConflictInfo => {
  // Find conflicting bookings for the same resource
  const conflictingBookings = bookings.filter(
    (booking) =>
      booking.resourceId === resourceId &&
      booking.status !== 'cancelled' &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime))
  );

  const hasConflict = conflictingBookings.length > 0;

  // Find alternative resources (same type, not booked at this time)
  const requestedResource = resources.find((r) => r.id === resourceId);
  const alternativeResources = resources.filter((resource) => {
    if (!requestedResource || resource.id === resourceId) return false;
    if (resource.type !== requestedResource.type) return false;

    const hasBookingConflict = bookings.some(
      (booking) =>
        booking.resourceId === resource.id &&
        booking.status !== 'cancelled' &&
        ((startTime >= booking.startTime && startTime < booking.endTime) ||
          (endTime > booking.startTime && endTime <= booking.endTime) ||
          (startTime <= booking.startTime && endTime >= booking.endTime))
    );

    return !hasBookingConflict;
  });

  // Generate alternative time slots (1 hour before and after)
  const alternativeTimeSlots: TimeSlot[] = [];
  
  if (hasConflict) {
    const slotBefore: TimeSlot = {
      start: new Date(startTime.getTime() - 60 * 60 * 1000),
      end: new Date(endTime.getTime() - 60 * 60 * 1000),
      available: true,
    };

    const slotAfter: TimeSlot = {
      start: new Date(startTime.getTime() + 60 * 60 * 1000),
      end: new Date(endTime.getTime() + 60 * 60 * 1000),
      available: true,
    };

    // Check if these slots are actually available
    const beforeConflict = bookings.some(
      (b) =>
        b.resourceId === resourceId &&
        b.status !== 'cancelled' &&
        ((slotBefore.start >= b.startTime && slotBefore.start < b.endTime) ||
          (slotBefore.end > b.startTime && slotBefore.end <= b.endTime))
    );

    const afterConflict = bookings.some(
      (b) =>
        b.resourceId === resourceId &&
        b.status !== 'cancelled' &&
        ((slotAfter.start >= b.startTime && slotAfter.start < b.endTime) ||
          (slotAfter.end > b.startTime && slotAfter.end <= b.endTime))
    );

    if (!beforeConflict) alternativeTimeSlots.push(slotBefore);
    if (!afterConflict) alternativeTimeSlots.push(slotAfter);
  }

  return {
    hasConflict,
    conflictingBookings,
    suggestions: {
      alternativeResources,
      alternativeTimeSlots,
    },
  };
};

export const calculateUtilization = (bookings: Booking[], resourceId?: string): number => {
  const relevantBookings = resourceId
    ? bookings.filter((b) => b.resourceId === resourceId && b.status !== 'cancelled')
    : bookings.filter((b) => b.status !== 'cancelled');

  if (relevantBookings.length === 0) return 0;

  const totalHours = relevantBookings.reduce((sum, booking) => {
    const duration = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60);
    return sum + duration;
  }, 0);

  // Assume 8 hours per day as maximum utilization
  const maxHours = 8 * 7; // 7 days
  return Math.min((totalHours / maxHours) * 100, 100);
};

export const getPeakHours = (bookings: Booking[]): { hour: number; count: number }[] => {
  const hourCounts: { [key: number]: number } = {};

  bookings
    .filter((b) => b.status !== 'cancelled')
    .forEach((booking) => {
      const startHour = booking.startTime.getHours();
      const endHour = booking.endTime.getHours();

      for (let hour = startHour; hour < endHour; hour++) {
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

  return Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
