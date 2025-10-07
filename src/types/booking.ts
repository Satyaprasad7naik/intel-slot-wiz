export type ResourceType = 'classroom' | 'lab' | 'auditorium' | 'equipment';

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  equipment: string[];
  imageUrl?: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
  status: BookingStatus;
  createdAt: Date;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  bookingId?: string;
}

export interface ConflictInfo {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  suggestions: {
    alternativeResources: Resource[];
    alternativeTimeSlots: TimeSlot[];
  };
}
