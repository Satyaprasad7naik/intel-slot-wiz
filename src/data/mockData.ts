import { Resource, Booking } from '@/types/booking';

export const mockResources: Resource[] = [
  {
    id: 'r1',
    name: 'Computer Lab A',
    type: 'lab',
    capacity: 30,
    location: 'Building A, Floor 2',
    equipment: ['Computers', 'Projector', 'Whiteboard', 'AC'],
  },
  {
    id: 'r2',
    name: 'Smart Classroom 101',
    type: 'classroom',
    capacity: 50,
    location: 'Building B, Floor 1',
    equipment: ['Smart Board', 'Projector', 'Sound System', 'AC'],
  },
  {
    id: 'r3',
    name: 'Innovation Lab',
    type: 'lab',
    capacity: 25,
    location: 'Building C, Floor 3',
    equipment: ['3D Printer', 'VR Headsets', 'Computers', 'Workshop Tools'],
  },
  {
    id: 'r4',
    name: 'Main Auditorium',
    type: 'auditorium',
    capacity: 200,
    location: 'Building A, Ground Floor',
    equipment: ['Stage', 'Sound System', 'Lighting', 'Projector', 'AC'],
  },
  {
    id: 'r5',
    name: 'Conference Room',
    type: 'classroom',
    capacity: 20,
    location: 'Building B, Floor 3',
    equipment: ['Video Conference', 'Whiteboard', 'Projector'],
  },
  {
    id: 'r6',
    name: 'Physics Lab',
    type: 'lab',
    capacity: 35,
    location: 'Building D, Floor 2',
    equipment: ['Lab Equipment', 'Safety Gear', 'Computers'],
  },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    resourceId: 'r1',
    userId: 'u1',
    userName: 'Dr. Sarah Johnson',
    startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM today
    endTime: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11 AM today
    purpose: 'Programming Workshop',
    status: 'confirmed',
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'b2',
    resourceId: 'r2',
    userId: 'u2',
    userName: 'Prof. Michael Chen',
    startTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM today
    endTime: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12 PM today
    purpose: 'Data Science Lecture',
    status: 'confirmed',
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'b3',
    resourceId: 'r4',
    userId: 'u3',
    userName: 'Events Team',
    startTime: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM today
    endTime: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5 PM today
    purpose: 'Tech Talk: AI in Industry',
    status: 'confirmed',
    createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'b4',
    resourceId: 'r1',
    userId: 'u4',
    userName: 'Student Council',
    startTime: new Date(today.getTime() + 13 * 60 * 60 * 1000), // 1 PM today
    endTime: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 3 PM today
    purpose: 'Hackathon Prep Session',
    status: 'confirmed',
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'b5',
    resourceId: 'r3',
    userId: 'u5',
    userName: 'Innovation Club',
    startTime: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 3 PM today
    endTime: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6 PM today
    purpose: '3D Printing Workshop',
    status: 'confirmed',
    createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
  },
];
