import { Vehicle, Customer, Booking, Branch } from './types';

// Mock branches
export const mockBranches: Branch[] = [
  {
    id: 'branch-1',
    name: 'Main Branch',
    location: 'Muscat',
  },
  {
    id: 'branch-2',
    name: 'Airport Branch',
    location: 'Seeb',
  },
  {
    id: 'branch-3',
    name: 'Tourist Branch',
    location: 'Salalah',
  }
];

// Mock Vehicles Data
export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    carNumber: 'OMA1234',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Silver',
    fuelType: 'petrol',
    type: 'sedan',
    status: 'available',
    pricePerDay: 25,
    currentKm: 12500,
    images: []
  },
  {
    id: 'v2',
    carNumber: 'OMA5678',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    color: 'White',
    fuelType: 'petrol',
    type: 'suv',
    status: 'available',
    pricePerDay: 30,
    currentKm: 8700,
    images: []
  },
  {
    id: 'v3',
    carNumber: 'OMA9012',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    color: 'Black',
    fuelType: 'hybrid',
    type: 'luxury',
    status: 'booked',
    pricePerDay: 55,
    currentKm: 5200,
    images: []
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
    id: 'c1',
    name: 'Ahmed Al Balushi',
    passport: 'A123456',
    phone: '+968 9123 4567',
    email: 'ahmed@example.com',
    dateAdded: '2023-01-15',
    branchId: 'branch-1',
    type: 'returning'
  },
  {
    id: 'c2',
    name: 'Sarah Johnson',
    passport: 'B789012',
    visa: 'V123456',
    phone: '+1 555-123-4567',
    email: 'sarah@example.com',
    address: '123 Tourist St, Muscat',
    dateAdded: '2023-02-20',
    branchId: 'branch-2',
    type: 'new'
  },
  {
    id: 'c3',
    name: 'Mohammed Al Habsi',
    passport: 'C345678',
    phone: '+968 9567 8901',
    email: 'mohammed@example.com',
    dateAdded: '2023-03-10',
    branchId: 'branch-3',
    type: 'returning'
  }
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    vehicleId: 'v1',
    customerId: 'c1',
    startDate: '2023-07-01T00:00:00.000Z',
    endDate: '2023-07-05T00:00:00.000Z',
    totalPrice: 125,
    status: 'completed',
    createdAt: '2023-06-25T00:00:00.000Z',
    updatedAt: '2023-07-05T00:00:00.000Z',
    branchId: 'branch-1',
    startKm: 12000,
    endKm: 12500,
    kmDriven: 500
  },
  {
    id: 'b2',
    vehicleId: 'v2',
    customerId: 'c2',
    startDate: '2023-08-10T00:00:00.000Z',
    endDate: '2023-08-15T00:00:00.000Z',
    totalPrice: 150,
    status: 'completed',
    createdAt: '2023-07-20T00:00:00.000Z',
    updatedAt: '2023-08-15T00:00:00.000Z',
    branchId: 'branch-2',
    startKm: 8500,
    endKm: 8700,
    kmDriven: 200
  },
  {
    id: 'b3',
    vehicleId: 'v3',
    customerId: 'c3',
    startDate: '2023-09-20T00:00:00.000Z',
    endDate: '2023-09-25T00:00:00.000Z',
    totalPrice: 275,
    status: 'ongoing',
    createdAt: '2023-09-15T00:00:00.000Z',
    updatedAt: '2023-09-20T00:00:00.000Z',
    branchId: 'branch-3',
    startKm: 5200
  }
];
