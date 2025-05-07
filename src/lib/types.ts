
export type UserRole = 'admin' | 'customer' | 'staff' | 'branch-manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // Branch ID for branch-specific users
}

export type VehicleStatus = 'available' | 'booked' | 'maintenance' | 'archived';

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';

export type VehicleType = 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van';

export interface Vehicle {
  id: string;
  carNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  fuelType: FuelType;
  type: VehicleType;
  status: VehicleStatus;
  pricePerDay: number;
  currentKm: number; // New field for current km reading
  images?: string[]; // Multiple images instead of single image
  lastUpdatedBy?: string; // Branch that last updated the vehicle
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  managerId?: string;
}

export type CustomerType = 'new' | 'returning';

export interface Customer {
  id: string;
  name: string;
  passport: string;
  visa?: string;
  phone: string;
  email: string;
  address?: string;
  dateAdded: string;
  branchId: string; // Which branch added this customer
  type: CustomerType; // New or returning customer
}

export type BookingStatus = 'pending' | 'ongoing' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  branchId: string; // Which branch created this booking
  startKm?: number; // Km reading at start of booking
  endKm?: number; // Km reading at end of booking
  kmDriven?: number; // Calculated km driven during booking
}
