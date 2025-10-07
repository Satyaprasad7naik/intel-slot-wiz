import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types/booking';
import { MapPin, Users, Calendar } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  isAvailable: boolean;
  onBook: (resourceId: string) => void;
}

export const ResourceCard = ({ resource, isAvailable, onBook }: ResourceCardProps) => {
  const typeColors = {
    classroom: 'bg-primary/10 text-primary',
    lab: 'bg-accent/10 text-accent',
    auditorium: 'bg-warning/10 text-warning',
    equipment: 'bg-secondary',
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{resource.name}</h3>
          <Badge className={typeColors[resource.type]}>
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </Badge>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isAvailable
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {isAvailable ? 'Available' : 'In Use'}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          {resource.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          Capacity: {resource.capacity} people
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Equipment:</p>
        <div className="flex flex-wrap gap-2">
          {resource.equipment.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onBook(resource.id)}
        className="w-full"
        disabled={!isAvailable}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Book Resource
      </Button>
    </Card>
  );
};
