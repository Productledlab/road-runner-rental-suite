
import { Vehicle, Customer, Booking } from './types';
import { mockVehicles, mockCustomers, mockBookings } from './mock-data';

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
};

// Get data from local storage
export const getVehicles = (): Vehicle[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('vehicles') || '[]');
};

export const getCustomers = (): Customer[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('customers') || '[]');
};

export const getBookings = (): Booking[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('bookings') || '[]');
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

export const archiveVehicle = (vehicleId: string): void => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === vehicleId);
  
  if (index >= 0) {
    vehicles[index].status = 'archived';
    updateVehicles(vehicles);
  }
};

// Get active bookings
export const getActiveBookings = (): Booking[] => {
  return getBookings().filter(booking => booking.status === 'ongoing');
};
