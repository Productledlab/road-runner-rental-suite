
export type UserRole = 'super_admin' | 'company_admin' | 'staff' | 'branch_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  branchId?: string;
  company_id?: string;
  branch_id?: string;
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

export type BranchType = 'active' | 'closed' | 'suspended';

export interface Branch {
  id: string;
  name: string;
  location: string;
  dateAdded: string;
  company_id: string;
  status: BranchType;
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

export interface Company {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  dateAdded: string;
  status: "active" | "suspended";
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
