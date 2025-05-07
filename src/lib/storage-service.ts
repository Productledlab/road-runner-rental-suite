
import { Vehicle, Customer, Booking, Branch } from './types';

// Initialize initial data for branches
const initialBranches = [
  {
    id: 'main',
    name: 'Main Branch',
    location: 'City Center'
  },
  {
    id: 'airport',
    name: 'Airport Branch',
    location: 'International Airport'
  },
  {
    id: 'tourist',
    name: 'Tourist Branch',
    location: 'Tourist District'
  }
];

// Initial data for vehicles
const initialVehicles = [
  {
    id: 'v1',
    carNumber: 'ABC-123',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'Black',
    fuelType: 'petrol',
    type: 'sedan',
    status: 'available',
    pricePerDay: 25,
    currentKm: 5000,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  },
  {
    id: 'v2',
    carNumber: 'XYZ-456',
    make: 'Honda',
    model: 'CR-V',
    year: 2022,
    color: 'White',
    fuelType: 'hybrid',
    type: 'suv',
    status: 'available',
    pricePerDay: 35,
    currentKm: 8000,
    images: ['/placeholder.svg', '/placeholder.svg']
  },
  {
    id: 'v3',
    carNumber: 'DEF-789',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    color: 'Blue',
    fuelType: 'petrol',
    type: 'luxury',
    status: 'available',
    pricePerDay: 50,
    currentKm: 3000,
    images: ['/placeholder.svg']
  },
  {
    id: 'v4',
    carNumber: 'GHI-012',
    make: 'Nissan',
    model: 'Altima',
    year: 2021,
    color: 'Silver',
    fuelType: 'petrol',
    type: 'sedan',
    status: 'available',
    pricePerDay: 22,
    currentKm: 12000,
    images: []
  }
];

// Initial data for customers
const initialCustomers = {
  main: [
    {
      id: 'cm1',
      name: 'John Smith',
      passport: 'A12345678',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
      dateAdded: '2023-05-01T00:00:00.000Z',
      branchId: 'main',
      type: 'returning'
    },
    {
      id: 'cm2',
      name: 'Jane Doe',
      passport: 'B87654321',
      phone: '+9876543210',
      email: 'jane@example.com',
      address: '456 Oak Ave',
      dateAdded: '2023-05-15T00:00:00.000Z',
      branchId: 'main',
      type: 'new'
    },
    {
      id: 'cm3',
      name: 'Robert Johnson',
      passport: 'C11223344',
      phone: '+1122334455',
      email: 'robert@example.com',
      address: '789 Pine Rd',
      dateAdded: '2023-06-01T00:00:00.000Z',
      branchId: 'main',
      type: 'returning'
    }
  ],
  airport: [
    {
      id: 'ca1',
      name: 'Sarah Williams',
      passport: 'D22334455',
      phone: '+2233445566',
      email: 'sarah@example.com',
      address: '321 Airport Rd',
      dateAdded: '2023-05-05T00:00:00.000Z',
      branchId: 'airport',
      type: 'returning'
    },
    {
      id: 'ca2',
      name: 'Michael Brown',
      passport: 'E33445566',
      phone: '+3344556677',
      email: 'michael@example.com',
      address: '654 Terminal Ave',
      dateAdded: '2023-05-20T00:00:00.000Z',
      branchId: 'airport',
      type: 'new'
    },
    {
      id: 'ca3',
      name: 'Emily Davis',
      passport: 'F44556677',
      phone: '+4455667788',
      email: 'emily@example.com',
      address: '987 Runway St',
      dateAdded: '2023-06-05T00:00:00.000Z',
      branchId: 'airport',
      type: 'returning'
    },
    {
      id: 'ca4',
      name: 'David Wilson',
      passport: 'G55667788',
      phone: '+5566778899',
      email: 'david@example.com',
      address: '159 Gate Rd',
      dateAdded: '2023-06-15T00:00:00.000Z',
      branchId: 'airport',
      type: 'returning'
    },
    {
      id: 'ca5',
      name: 'Lisa Taylor',
      passport: 'H66778899',
      phone: '+6677889900',
      email: 'lisa@example.com',
      address: '753 Baggage St',
      dateAdded: '2023-06-25T00:00:00.000Z',
      branchId: 'airport',
      type: 'new'
    }
  ],
  tourist: [
    {
      id: 'ct1',
      name: 'James Anderson',
      passport: 'I77889900',
      phone: '+7788990011',
      email: 'james@example.com',
      address: '246 Beach Rd',
      dateAdded: '2023-05-10T00:00:00.000Z',
      branchId: 'tourist',
      type: 'returning'
    },
    {
      id: 'ct2',
      name: 'Jennifer Martin',
      passport: 'J88990011',
      phone: '+8899001122',
      email: 'jennifer@example.com',
      address: '864 Resort Ave',
      dateAdded: '2023-05-25T00:00:00.000Z',
      branchId: 'tourist',
      type: 'new'
    },
    {
      id: 'ct3',
      name: 'Daniel Thomas',
      passport: 'K99001122',
      phone: '+9900112233',
      email: 'daniel@example.com',
      address: '975 Hotel St',
      dateAdded: '2023-06-10T00:00:00.000Z',
      branchId: 'tourist',
      type: 'returning'
    },
    {
      id: 'ct4',
      name: 'Michelle Garcia',
      passport: 'L00112233',
      phone: '+0011223344',
      email: 'michelle@example.com',
      address: '357 Souvenir Rd',
      dateAdded: '2023-06-20T00:00:00.000Z',
      branchId: 'tourist',
      type: 'returning'
    },
    {
      id: 'ct5',
      name: 'Kevin Lee',
      passport: 'M11223344',
      phone: '+1122334455',
      email: 'kevin@example.com',
      address: '951 Tour Ave',
      dateAdded: '2023-07-01T00:00:00.000Z',
      branchId: 'tourist',
      type: 'new'
    },
    {
      id: 'ct6',
      name: 'Patricia Rodriguez',
      passport: 'N22334455',
      phone: '+2233445566',
      email: 'patricia@example.com',
      address: '753 Vacation St',
      dateAdded: '2023-07-05T00:00:00.000Z',
      branchId: 'tourist',
      type: 'returning'
    },
    {
      id: 'ct7',
      name: 'Richard Martinez',
      passport: 'O33445566',
      phone: '+3344556677',
      email: 'richard@example.com',
      address: '159 Sightseeing Rd',
      dateAdded: '2023-07-10T00:00:00.000Z',
      branchId: 'tourist',
      type: 'new'
    },
    {
      id: 'ct8',
      name: 'Linda Hernandez',
      passport: 'P44556677',
      phone: '+4455667788',
      email: 'linda@example.com',
      address: '357 Landmark Ave',
      dateAdded: '2023-07-15T00:00:00.000Z',
      branchId: 'tourist',
      type: 'returning'
    },
    {
      id: 'ct9',
      name: 'Joseph Lopez',
      passport: 'Q55667788',
      phone: '+5566778899',
      email: 'joseph@example.com',
      address: '246 Monument St',
      dateAdded: '2023-07-20T00:00:00.000Z',
      branchId: 'tourist',
      type: 'new'
    },
    {
      id: 'ct10',
      name: 'Nancy Gonzalez',
      passport: 'R66778899',
      phone: '+6677889900',
      email: 'nancy@example.com',
      address: '864 Attraction Rd',
      dateAdded: '2023-07-25T00:00:00.000Z',
      branchId: 'tourist',
      type: 'returning'
    }
  ]
};

// Initial data for bookings
const createInitialBookings = () => {
  const bookings = [];
  
  // Main branch bookings
  const mainBookings = [
    {
      id: 'bm1',
      vehicleId: 'v1',
      customerId: 'cm1',
      startDate: '2023-08-01T00:00:00.000Z',
      endDate: '2023-08-05T00:00:00.000Z',
      totalPrice: 125,
      status: 'completed',
      createdAt: '2023-07-25T00:00:00.000Z',
      updatedAt: '2023-08-05T00:00:00.000Z',
      branchId: 'main',
      startKm: 5000,
      endKm: 5300,
      kmDriven: 300
    },
    {
      id: 'bm2',
      vehicleId: 'v2',
      customerId: 'cm2',
      startDate: '2023-08-06T00:00:00.000Z',
      endDate: '2023-08-10T00:00:00.000Z',
      totalPrice: 175,
      status: 'completed',
      createdAt: '2023-07-30T00:00:00.000Z',
      updatedAt: '2023-08-10T00:00:00.000Z',
      branchId: 'main',
      startKm: 8000,
      endKm: 8250,
      kmDriven: 250
    },
    {
      id: 'bm3',
      vehicleId: 'v3',
      customerId: 'cm3',
      startDate: '2023-08-11T00:00:00.000Z',
      endDate: '2023-08-12T00:00:00.000Z',
      totalPrice: 50,
      status: 'completed',
      createdAt: '2023-08-01T00:00:00.000Z',
      updatedAt: '2023-08-12T00:00:00.000Z',
      branchId: 'main',
      startKm: 3000,
      endKm: 3100,
      kmDriven: 100
    },
    {
      id: 'bm4',
      vehicleId: 'v4',
      customerId: 'cm1',
      startDate: '2023-08-15T00:00:00.000Z',
      endDate: '2023-08-20T00:00:00.000Z',
      totalPrice: 110,
      status: 'ongoing',
      createdAt: '2023-08-10T00:00:00.000Z',
      updatedAt: '2023-08-15T00:00:00.000Z',
      branchId: 'main',
      startKm: 12000
    }
  ];
  
  // Airport branch bookings
  const airportBookings = [
    {
      id: 'ba1',
      vehicleId: 'v1',
      customerId: 'ca1',
      startDate: '2023-07-15T00:00:00.000Z',
      endDate: '2023-07-20T00:00:00.000Z',
      totalPrice: 125,
      status: 'completed',
      createdAt: '2023-07-01T00:00:00.000Z',
      updatedAt: '2023-07-20T00:00:00.000Z',
      branchId: 'airport',
      startKm: 4700,
      endKm: 5000,
      kmDriven: 300
    },
    {
      id: 'ba2',
      vehicleId: 'v2',
      customerId: 'ca2',
      startDate: '2023-07-21T00:00:00.000Z',
      endDate: '2023-07-25T00:00:00.000Z',
      totalPrice: 140,
      status: 'completed',
      createdAt: '2023-07-10T00:00:00.000Z',
      updatedAt: '2023-07-25T00:00:00.000Z',
      branchId: 'airport',
      startKm: 7800,
      endKm: 8000,
      kmDriven: 200
    },
    {
      id: 'ba3',
      vehicleId: 'v3',
      customerId: 'ca3',
      startDate: '2023-07-26T00:00:00.000Z',
      endDate: '2023-07-28T00:00:00.000Z',
      totalPrice: 100,
      status: 'completed',
      createdAt: '2023-07-15T00:00:00.000Z',
      updatedAt: '2023-07-28T00:00:00.000Z',
      branchId: 'airport',
      startKm: 2900,
      endKm: 3000,
      kmDriven: 100
    },
    {
      id: 'ba4',
      vehicleId: 'v4',
      customerId: 'ca4',
      startDate: '2023-07-29T00:00:00.000Z',
      endDate: '2023-08-02T00:00:00.000Z',
      totalPrice: 110,
      status: 'completed',
      createdAt: '2023-07-20T00:00:00.000Z',
      updatedAt: '2023-08-02T00:00:00.000Z',
      branchId: 'airport',
      startKm: 11800,
      endKm: 12000,
      kmDriven: 200
    },
    {
      id: 'ba5',
      vehicleId: 'v1',
      customerId: 'ca5',
      startDate: '2023-08-10T00:00:00.000Z',
      endDate: '2023-08-15T00:00:00.000Z',
      totalPrice: 125,
      status: 'ongoing',
      createdAt: '2023-08-01T00:00:00.000Z',
      updatedAt: '2023-08-10T00:00:00.000Z',
      branchId: 'airport',
      startKm: 5300
    },
    {
      id: 'ba6',
      vehicleId: 'v2',
      customerId: 'ca1',
      startDate: '2023-08-20T00:00:00.000Z',
      endDate: '2023-08-25T00:00:00.000Z',
      totalPrice: 175,
      status: 'pending',
      createdAt: '2023-08-05T00:00:00.000Z',
      updatedAt: '2023-08-05T00:00:00.000Z',
      branchId: 'airport'
    }
  ];
  
  // Tourist branch bookings - just adding some for illustration
  const touristBookings = Array(15).fill(null).map((_, index) => {
    const customerId = `ct${(index % 10) + 1}`;
    const vehicleId = `v${(index % 4) + 1}`;
    const startDay = index + 1;
    const endDay = startDay + 3;
    const startMonth = 6; // July
    const startDate = new Date(2023, startMonth, startDay);
    const endDate = new Date(2023, startMonth, endDay);
    const createdDate = new Date(2023, startMonth - 1, 25 + index % 5);
    const price = (index % 4 + 1) * 25 * 3;
    const status = index < 10 ? 'completed' : (index < 13 ? 'ongoing' : 'pending');
    const startKm = 1000 + (index * 100);
    const endKm = startKm + (index * 50);
    
    return {
      id: `bt${index + 1}`,
      vehicleId,
      customerId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice: price,
      status,
      createdAt: createdDate.toISOString(),
      updatedAt: status === 'completed' ? endDate.toISOString() : createdDate.toISOString(),
      branchId: 'tourist',
      startKm: startKm,
      ...(status === 'completed' && {
        endKm: endKm,
        kmDriven: endKm - startKm
      })
    };
  });
  
  return [...mainBookings, ...airportBookings, ...touristBookings];
};

// Initialize local storage with initial data
const initializeStorage = () => {
  localStorage.removeItem('vehicles');
  localStorage.removeItem('customers');
  localStorage.removeItem('bookings');
  localStorage.removeItem('branches');

  localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
  localStorage.setItem('customers', JSON.stringify([
    ...initialCustomers.main,
    ...initialCustomers.airport,
    ...initialCustomers.tourist
  ]));
  localStorage.setItem('bookings', JSON.stringify(createInitialBookings()));
  localStorage.setItem('branches', JSON.stringify(initialBranches));

  if (!localStorage.getItem('currentBranch')) {
    localStorage.setItem('currentBranch', initialBranches[0].id);
  }
  
  // Set data initialized flag
  localStorage.setItem('dataInitialized', 'true');
};

// Check if data is initialized
const checkDataInitialized = () => {
  return localStorage.getItem('dataInitialized') === 'true';
};

// Get data from local storage
export const getVehicles = (): Vehicle[] => {
  if (!checkDataInitialized()) {
    initializeStorage();
  }
  return JSON.parse(localStorage.getItem('vehicles') || '[]');
};

export const getCustomers = (branchId?: string): Customer[] => {
  if (!checkDataInitialized()) {
    initializeStorage();
  }
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  
  if (branchId && branchId !== 'all') {
    return customers.filter((customer: Customer) => customer.branchId === branchId);
  }
  
  return customers;
};

export const getBookings = (branchId?: string): Booking[] => {
  if (!checkDataInitialized()) {
    initializeStorage();
  }
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  
  if (branchId && branchId !== 'all') {
    return bookings.filter((booking: Booking) => booking.branchId === branchId);
  }
  
  return bookings;
};

export const getBranches = (): Branch[] => {
  if (!checkDataInitialized()) {
    initializeStorage();
  }
  return JSON.parse(localStorage.getItem('branches') || '[]');
};

export const getCurrentBranch = (): string => {
  if (!checkDataInitialized()) {
    initializeStorage();
  }
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
  
  // Calculate revenue from all bookings (since payments are made in advance)
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
  return {
    totalVehicles,
    availableVehicles,
    activeBookings,
    totalRevenue,
    customers: customers.length
  };
};

// Reset the data (for testing purposes)
export const resetData = () => {
  localStorage.removeItem('dataInitialized');
  initializeStorage();
};
