import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Resource, Booking, ConflictInfo } from '@/types/booking';
import { checkConflicts, formatTime, formatDate } from '@/utils/bookingUtils';
import { AlertCircle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface BookingFormProps {
  resources: Resource[];
  bookings: Booking[];
  selectedResourceId?: string;
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onClose?: () => void;
}

export const BookingForm = ({
  resources,
  bookings,
  selectedResourceId,
  onBookingSubmit,
  onClose,
}: BookingFormProps) => {
  const [resourceId, setResourceId] = useState(selectedResourceId || '');
  const [userName, setUserName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [conflictInfo, setConflictInfo] = useState<ConflictInfo | null>(null);

  const handleCheckAvailability = () => {
    if (!resourceId || !date || !startTime || !endTime) {
      toast.error('Please fill in all fields');
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (end <= start) {
      toast.error('End time must be after start time');
      return;
    }

    const conflicts = checkConflicts(resourceId, start, end, bookings, resources);
    setConflictInfo(conflicts);

    if (conflicts.hasConflict) {
      toast.warning('Conflict detected! Check suggestions below');
    } else {
      toast.success('Time slot is available!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (conflictInfo?.hasConflict) {
      toast.error('Cannot book - conflicts exist. Please choose an alternative');
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    onBookingSubmit({
      resourceId,
      userId: 'current-user',
      userName,
      startTime: start,
      endTime: end,
      purpose,
      status: 'confirmed',
    });

    toast.success('Booking confirmed successfully!');
    onClose?.();
  };

  const selectedResource = resources.find((r) => r.id === resourceId);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Book a Resource</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="resource">Select Resource</Label>
          <Select value={resourceId} onValueChange={setResourceId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a resource" />
            </SelectTrigger>
            <SelectContent>
              {resources.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  {resource.name} - {resource.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedResource && (
          <div className="p-4 bg-secondary rounded-lg space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{selectedResource.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Capacity: {selectedResource.capacity}</span>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="userName">Your Name</Label>
          <Input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <Textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe the purpose of booking"
            required
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="button" onClick={handleCheckAvailability} variant="outline" className="w-full">
          Check Availability
        </Button>

        {conflictInfo && (
          <div
            className={`p-4 rounded-lg ${
              conflictInfo.hasConflict ? 'bg-destructive/10' : 'bg-success/10'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {conflictInfo.hasConflict ? (
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-semibold mb-1">
                  {conflictInfo.hasConflict ? 'Conflict Detected' : 'Available!'}
                </h4>
                {conflictInfo.hasConflict && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {conflictInfo.conflictingBookings.length} conflicting booking(s) found
                  </p>
                )}
              </div>
            </div>

            {conflictInfo.hasConflict && (
              <div className="mt-4 space-y-3">
                {conflictInfo.suggestions.alternativeTimeSlots.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Alternative Time Slots:</h5>
                    <div className="space-y-2">
                      {conflictInfo.suggestions.alternativeTimeSlots.map((slot, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-background rounded flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(slot.start)} - {formatTime(slot.end)}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setStartTime(formatTime(slot.start));
                              setEndTime(formatTime(slot.end));
                            }}
                          >
                            Use This
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {conflictInfo.suggestions.alternativeResources.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Alternative Resources:</h5>
                    <div className="space-y-2">
                      {conflictInfo.suggestions.alternativeResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="p-2 bg-background rounded flex items-center justify-between"
                        >
                          <div className="text-sm">
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-muted-foreground text-xs">{resource.location}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setResourceId(resource.id)}
                          >
                            Switch
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={!conflictInfo || conflictInfo.hasConflict}>
          Confirm Booking
        </Button>
      </form>
    </Card>
  );
};
