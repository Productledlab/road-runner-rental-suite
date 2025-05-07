
import { Vehicle, Customer, Booking, Branch } from './types';
import { mockVehicles, mockCustomers, mockBookings, mockBranches } from './mock-data';

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem('vehicles')) {
    localStorage.setItem('vehicles', JSON.stringify(mockVehicles));
  }
  
  if (!localStorage.getItem('customers')) {
    localStorage.setItem('customers', JSON.stringify(mockCustomers));
  }
  
  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify(mockBookings));
  }

  if (!localStorage.getItem('branches')) {
    localStorage.setItem('branches', JSON.stringify(mockBranches));
  }

  if (!localStorage.getItem('currentBranch')) {
    localStorage.setItem('currentBranch', mockBranches[0].id);
  }
};

// Get data from local storage
export const getVehicles = (): Vehicle[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('vehicles') || '[]');
};

export const getCustomers = (branchId?: string): Customer[] => {
  initializeStorage();
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  
  if (branchId) {
    return customers.filter((customer: Customer) => customer.branchId === branchId);
  }
  
  return customers;
};

export const getBookings = (branchId?: string): Booking[] => {
  initializeStorage();
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  
  if (branchId) {
    return bookings.filter((booking: Booking) => booking.branchId === branchId);
  }
  
  return bookings;
};

export const getBranches = (): Branch[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('branches') || '[]');
};

export const getCurrentBranch = (): string => {
  initializeStorage();
  return localStorage.getItem('currentBranch') || '';
};

export const setCurrentBranch = (branchId: string): void => {
  localStorage.setItem('currentBranch', branchId);
};

// Update data in local storage
export const updateVehicles = (vehicles: Vehicle[]): void => {
  localStorage.setItem('vehicles', JSON.stringify(vehicles));
};

export const updateCustomers = (customers: Customer[]): void => {
  localStorage.setItem('customers', JSON.stringify(customers));
};

export const updateBookings = (bookings: Booking[]): void => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

export const updateBranches = (branches: Branch[]): void => {
  localStorage.setItem('branches', JSON.stringify(branches));
};

// Single item operations
export const saveVehicle = (vehicle: Vehicle): Vehicle => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === vehicle.id);
  
  if (index >= 0) {
    vehicles[index] = vehicle;
  } else {
    vehicles.push(vehicle);
  }
  
  updateVehicles(vehicles);
  return vehicle;
};

export const saveCustomer = (customer: Customer): Customer => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === customer.id);
  
  if (index >= 0) {
    customers[index] = customer;
  } else {
    customers.push(customer);
  }
  
  updateCustomers(customers);
  return customer;
};

export const saveBooking = (booking: Booking): Booking => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === booking.id);
  
  if (index >= 0) {
    bookings[index] = booking;
  } else {
    bookings.push(booking);
  }
  
  updateBookings(bookings);
  return booking;
};

export const completeBooking = (bookingId: string, endKm: number): Booking | null => {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) return null;
  
  const booking = bookings[bookingIndex];
  const startKm = booking.startKm || 0;
  const kmDriven = endKm - startKm;
  
  // Update booking
  booking.status = 'completed';
  booking.endKm = endKm;
  booking.kmDriven = kmDriven;
  booking.updatedAt = new Date().toISOString();
  
  // Update the vehicle's current km reading
  const vehicles = getVehicles();
  const vehicleIndex = vehicles.findIndex(v => v.id === booking.vehicleId);
  
  if (vehicleIndex !== -1) {
    vehicles[vehicleIndex].currentKm = endKm;
    updateVehicles(vehicles);
  }
  
  // Save updated booking
  bookings[bookingIndex] = booking;
  updateBookings(bookings);
  
  return booking;
};

export const archiveVehicle = (vehicleId: string): void => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === vehicleId);
  
  if (index >= 0) {
    vehicles[index].status = 'archived';
    updateVehicles(vehicles);
  }
};

// Get active bookings
export const getActiveBookings = (branchId?: string): Booking[] => {
  const bookings = getBookings(branchId);
  return bookings.filter(booking => booking.status === 'ongoing');
};

// Get unique makes and models for vehicles
export const getUniqueMakes = (): string[] => {
  const vehicles = getVehicles();
  const makes = [...new Set(vehicles.map(v => v.make))];
  return makes.sort();
};

export const getUniqueModels = (make?: string): string[] => {
  const vehicles = getVehicles();
  let filteredVehicles = vehicles;
  
  if (make) {
    filteredVehicles = vehicles.filter(v => v.make === make);
  }
  
  const models = [...new Set(filteredVehicles.map(v => v.model))];
  return models.sort();
};

// Check if a vehicle is available for booking in a specific date range
export const isVehicleAvailable = (vehicleId: string, startDate: string, endDate: string, excludeBookingId?: string): boolean => {
  const bookings = getBookings();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return !bookings.some(booking => {
    // Skip the current booking if we're editing
    if (excludeBookingId && booking.id === excludeBookingId) {
      return false;
    }
    
    // Skip if not the same vehicle
    if (booking.vehicleId !== vehicleId) {
      return false;
    }
    
    // Skip if booking is cancelled
    if (booking.status === 'cancelled') {
      return false;
    }
    
    // Check for date overlap
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    // Check if the dates overlap
    return (start <= bookingEnd && end >= bookingStart);
  });
};

// Get available vehicles for a date range
export const getAvailableVehicles = (startDate: string, endDate: string, excludeBookingId?: string): Vehicle[] => {
  const vehicles = getVehicles().filter(v => v.status !== 'archived' && v.status !== 'maintenance');
  
  return vehicles.filter(vehicle => 
    isVehicleAvailable(vehicle.id, startDate, endDate, excludeBookingId)
  );
};

// Update customer type based on booking history
export const updateCustomerType = (customerId: string): void => {
  const customers = getCustomers();
  const customerIndex = customers.findIndex(c => c.id === customerId);
  
  if (customerIndex === -1) return;
  
  const bookings = getBookings();
  const customerBookings = bookings.filter(b => b.customerId === customerId);
  
  const type = customerBookings.length > 0 ? 'returning' : 'new';
  customers[customerIndex].type = type;
  
  updateCustomers(customers);
};

// Get statistics for dashboard
export const getDashboardStats = (branchId?: string) => {
  const vehicles = getVehicles();
  const bookings = getBookings(branchId);
  const customers = getCustomers(branchId);
  
  const totalVehicles = vehicles.filter(v => v.status !== 'archived').length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const activeBookings = bookings.filter(b => b.status === 'ongoing').length;
  
  // Calculate revenue
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);
    
  return {
    totalVehicles,
    availableVehicles,
    activeBookings,
    totalRevenue,
    customers: customers.length
  };
};
