
import { Vehicle, Customer, Booking } from './types';

// Mock Vehicles Data
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    carNumber: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Silver',
    fuelType: 'petrol',
    type: 'sedan',
    status: 'available',
    pricePerDay: 55,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2',
    carNumber: 'DEF456',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    color: 'Blue',
    fuelType: 'petrol',
    type: 'suv',
    status: 'booked',
    pricePerDay: 65,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3',
    carNumber: 'GHI789',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    color: 'White',
    fuelType: 'electric',
    type: 'sedan',
    status: 'available',
    pricePerDay: 90,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '4',
    carNumber: 'JKL012',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    color: 'Black',
    fuelType: 'diesel',
    type: 'luxury',
    status: 'maintenance',
    pricePerDay: 120,
    image: 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '5',
    carNumber: 'MNO345',
    make: 'Ford',
    model: 'Focus',
    year: 2020,
    color: 'Red',
    fuelType: 'petrol',
    type: 'hatchback',
    status: 'available',
    pricePerDay: 45,
    image: 'https://images.unsplash.com/photo-1606611013016-308138517d7a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '6',
    carNumber: 'PQR678',
    make: 'Mercedes',
    model: 'E-Class',
    year: 2023,
    color: 'Silver',
    fuelType: 'hybrid',
    type: 'luxury',
    status: 'available',
    pricePerDay: 110,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '7',
    carNumber: 'STU901',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2021,
    color: 'Green',
    fuelType: 'petrol',
    type: 'suv',
    status: 'booked',
    pricePerDay: 60,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400&auto=format&fit=crop'
  }
];

// Mock Archived Vehicles
export const mockArchivedVehicles: Vehicle[] = [
  {
    id: '8',
    carNumber: 'VWX234',
    make: 'Toyota',
    model: 'Corolla',
    year: 2018,
    color: 'Blue',
    fuelType: 'petrol',
    type: 'sedan',
    status: 'archived',
    pricePerDay: 40
  },
  {
    id: '9',
    carNumber: 'YZA567',
    make: 'Nissan',
    model: 'Altima',
    year: 2017,
    color: 'Gray',
    fuelType: 'petrol',
    type: 'sedan',
    status: 'archived',
    pricePerDay: 38
  }
];

// Mock Customers Data
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    passport: 'AB1234567',
    visa: 'V123456789',
    phone: '+1 123-456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St, City, Country',
    dateAdded: '2023-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    passport: 'CD7654321',
    visa: 'V987654321',
    phone: '+1 234-567-8901',
    email: 'jane.smith@example.com',
    address: '456 Elm St, City, Country',
    dateAdded: '2023-02-20'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    passport: 'EF9876543',
    phone: '+1 345-678-9012',
    email: 'michael.j@example.com',
    dateAdded: '2023-03-10'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    passport: 'GH5432109',
    visa: 'V543210987',
    phone: '+1 456-789-0123',
    email: 'sarah.w@example.com',
    address: '789 Oak St, City, Country',
    dateAdded: '2023-04-05'
  },
  {
    id: '5',
    name: 'David Brown',
    passport: 'IJ4567890',
    phone: '+1 567-890-1234',
    email: 'david.b@example.com',
    dateAdded: '2023-05-12'
  }
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: '1',
    vehicleId: '2',
    customerId: '1',
    startDate: '2023-06-10T10:00:00',
    endDate: '2023-06-15T10:00:00',
    totalPrice: 325,
    status: 'completed',
    createdAt: '2023-06-01T14:30:00',
    updatedAt: '2023-06-15T10:30:00'
  },
  {
    id: '2',
    vehicleId: '7',
    customerId: '2',
    startDate: '2023-06-20T09:00:00',
    endDate: '2023-06-25T09:00:00',
    totalPrice: 300,
    status: 'ongoing',
    createdAt: '2023-06-15T11:45:00',
    updatedAt: '2023-06-20T09:15:00'
  },
  {
    id: '3',
    vehicleId: '1',
    customerId: '3',
    startDate: '2023-07-05T14:00:00',
    endDate: '2023-07-10T14:00:00',
    totalPrice: 275,
    status: 'pending',
    createdAt: '2023-06-25T16:20:00',
    updatedAt: '2023-06-25T16:20:00'
  },
  {
    id: '4',
    vehicleId: '3',
    customerId: '4',
    startDate: '2023-06-18T12:00:00',
    endDate: '2023-06-19T12:00:00',
    totalPrice: 90,
    status: 'cancelled',
    createdAt: '2023-06-10T09:30:00',
    updatedAt: '2023-06-11T15:45:00'
  },
  {
    id: '5',
    vehicleId: '6',
    customerId: '5',
    startDate: '2023-07-15T11:00:00',
    endDate: '2023-07-20T11:00:00',
    totalPrice: 550,
    status: 'pending',
    createdAt: '2023-06-30T13:15:00',
    updatedAt: '2023-06-30T13:15:00'
  }
];
