
export type UserRole = 'admin' | 'customer' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  passport: string;
  visa?: string;
  phone: string;
  email: string;
  address?: string;
  dateAdded: string;
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
}
