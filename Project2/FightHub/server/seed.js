require('dotenv').config();
const mongoose = require('mongoose');
const Flight = require('./models/Flight');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Flight.deleteMany({});
    await User.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@flightbooking.com',
      password: 'admin123',
      userType: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    // Create sample customer
    const customer = await User.create({
      username: 'arjun',
      email: 'arjun@example.com',
      password: 'password123',
      userType: 'customer',
      profile: {
        firstName: 'Arjun',
        lastName: 'Kumar',
        phone: '+91-9876543210',
        passportNumber: 'P1234567',
        frequentFlyerNumber: 'FF123456'
      },
      preferences: {
        seatPreference: 'window',
        mealPreference: 'vegetarian'
      }
    });

    console.log('✅ Created users');

    // Helper function to generate dates for the next 30 days
    const generateDate = (daysFromNow, hours, minutes) => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    // Create comprehensive flight list
    const flights = [
      // DEL to BOM routes
      {
        flightId: 'AI101',
        flightName: 'Air India Express',
        airline: 'Air India',
        origin: 'DEL',
        destination: 'BOM',
        departureTime: generateDate(1, 6, 0),
        arrivalTime: generateDate(1, 8, 15),
        duration: '2h 15m',
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 3500,
        classes: [
          { className: 'economy', price: 3500, availableSeats: 120 },
          { className: 'business', price: 8500, availableSeats: 30 },
          { className: 'first-class', price: 15000, availableSeats: 12 }
        ],
        status: 'scheduled',
        gate: 'A12',
        terminal: 'T3',
        aircraft: 'Boeing 737'
      },
      {
        flightId: 'IG201',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'DEL',
        destination: 'BOM',
        departureTime: generateDate(1, 9, 30),
        arrivalTime: generateDate(1, 11, 45),
        duration: '2h 15m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 2999,
        classes: [
          { className: 'economy', price: 2999, availableSeats: 150 },
          { className: 'business', price: 7500, availableSeats: 36 }
        ],
        status: 'scheduled',
        gate: 'B5',
        terminal: 'T1',
        aircraft: 'Airbus A320'
      },
      {
        flightId: 'SG301',
        flightName: 'SpiceJet',
        airline: 'SpiceJet',
        origin: 'DEL',
        destination: 'BOM',
        departureTime: generateDate(1, 14, 0),
        arrivalTime: generateDate(1, 16, 15),
        duration: '2h 15m',
        totalSeats: 150,
        availableSeats: 150,
        basePrice: 2799,
        classes: [
          { className: 'economy', price: 2799, availableSeats: 120 },
          { className: 'premium-economy', price: 4500, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'C8',
        terminal: 'T2',
        aircraft: 'Boeing 737 MAX'
      },
      {
        flightId: 'UK401',
        flightName: 'Vistara',
        airline: 'Vistara',
        origin: 'DEL',
        destination: 'BOM',
        departureTime: generateDate(1, 18, 30),
        arrivalTime: generateDate(1, 20, 45),
        duration: '2h 15m',
        totalSeats: 164,
        availableSeats: 164,
        basePrice: 4200,
        classes: [
          { className: 'economy', price: 4200, availableSeats: 100 },
          { className: 'premium-economy', price: 6500, availableSeats: 32 },
          { className: 'business', price: 12000, availableSeats: 32 }
        ],
        status: 'scheduled',
        gate: 'D3',
        terminal: 'T3',
        aircraft: 'Airbus A321'
      },

      // BOM to DEL routes
      {
        flightId: 'AI102',
        flightName: 'Air India',
        airline: 'Air India',
        origin: 'BOM',
        destination: 'DEL',
        departureTime: generateDate(1, 7, 0),
        arrivalTime: generateDate(1, 9, 15),
        duration: '2h 15m',
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 3600,
        classes: [
          { className: 'economy', price: 3600, availableSeats: 120 },
          { className: 'business', price: 9000, availableSeats: 30 },
          { className: 'first-class', price: 16000, availableSeats: 12 }
        ],
        status: 'scheduled',
        gate: 'E7',
        terminal: 'T2',
        aircraft: 'Boeing 787'
      },
      {
        flightId: 'IG202',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'BOM',
        destination: 'DEL',
        departureTime: generateDate(1, 12, 0),
        arrivalTime: generateDate(1, 14, 15),
        duration: '2h 15m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 3100,
        classes: [
          { className: 'economy', price: 3100, availableSeats: 150 },
          { className: 'business', price: 7800, availableSeats: 36 }
        ],
        status: 'scheduled',
        gate: 'F2',
        terminal: 'T1',
        aircraft: 'Airbus A320neo'
      },

      // DEL to BLR routes
      {
        flightId: 'IG302',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'DEL',
        destination: 'BLR',
        departureTime: generateDate(1, 5, 30),
        arrivalTime: generateDate(1, 8, 15),
        duration: '2h 45m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 3800,
        classes: [
          { className: 'economy', price: 3800, availableSeats: 156 },
          { className: 'business', price: 9500, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'A5',
        terminal: 'T1',
        aircraft: 'Airbus A321'
      },
      {
        flightId: 'UK501',
        flightName: 'Vistara',
        airline: 'Vistara',
        origin: 'DEL',
        destination: 'BLR',
        departureTime: generateDate(1, 10, 0),
        arrivalTime: generateDate(1, 12, 45),
        duration: '2h 45m',
        totalSeats: 164,
        availableSeats: 164,
        basePrice: 4500,
        classes: [
          { className: 'economy', price: 4500, availableSeats: 100 },
          { className: 'premium-economy', price: 7000, availableSeats: 32 },
          { className: 'business', price: 14000, availableSeats: 32 }
        ],
        status: 'scheduled',
        gate: 'B8',
        terminal: 'T3',
        aircraft: 'Boeing 787 Dreamliner'
      },
      {
        flightId: 'AI501',
        flightName: 'Air India',
        airline: 'Air India',
        origin: 'DEL',
        destination: 'BLR',
        departureTime: generateDate(1, 16, 0),
        arrivalTime: generateDate(1, 18, 45),
        duration: '2h 45m',
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 4100,
        classes: [
          { className: 'economy', price: 4100, availableSeats: 120 },
          { className: 'business', price: 11000, availableSeats: 30 },
          { className: 'first-class', price: 18000, availableSeats: 12 }
        ],
        status: 'scheduled',
        gate: 'C3',
        terminal: 'T3',
        aircraft: 'Airbus A350'
      },

      // BLR to DEL routes
      {
        flightId: 'UK502',
        flightName: 'Vistara',
        airline: 'Vistara',
        origin: 'BLR',
        destination: 'DEL',
        departureTime: generateDate(1, 7, 0),
        arrivalTime: generateDate(1, 9, 45),
        duration: '2h 45m',
        totalSeats: 164,
        availableSeats: 164,
        basePrice: 4300,
        classes: [
          { className: 'economy', price: 4300, availableSeats: 100 },
          { className: 'premium-economy', price: 6800, availableSeats: 32 },
          { className: 'business', price: 13500, availableSeats: 32 }
        ],
        status: 'scheduled',
        gate: 'D5',
        terminal: 'T2',
        aircraft: 'Boeing 787'
      },

      // BOM to BLR routes
      {
        flightId: 'SG401',
        flightName: 'SpiceJet',
        airline: 'SpiceJet',
        origin: 'BOM',
        destination: 'BLR',
        departureTime: generateDate(1, 8, 30),
        arrivalTime: generateDate(1, 10, 0),
        duration: '1h 30m',
        totalSeats: 150,
        availableSeats: 150,
        basePrice: 2500,
        classes: [
          { className: 'economy', price: 2500, availableSeats: 120 },
          { className: 'premium-economy', price: 4000, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'E2',
        terminal: 'T2',
        aircraft: 'Boeing 737'
      },
      {
        flightId: 'IG401',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'BOM',
        destination: 'BLR',
        departureTime: generateDate(1, 13, 0),
        arrivalTime: generateDate(1, 14, 30),
        duration: '1h 30m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 2800,
        classes: [
          { className: 'economy', price: 2800, availableSeats: 150 },
          { className: 'business', price: 6500, availableSeats: 36 }
        ],
        status: 'scheduled',
        gate: 'F8',
        terminal: 'T1',
        aircraft: 'Airbus A320'
      },

      // DEL to HYD routes
      {
        flightId: 'AI601',
        flightName: 'Air India',
        airline: 'Air India',
        origin: 'DEL',
        destination: 'HYD',
        departureTime: generateDate(1, 6, 30),
        arrivalTime: generateDate(1, 8, 45),
        duration: '2h 15m',
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 3300,
        classes: [
          { className: 'economy', price: 3300, availableSeats: 120 },
          { className: 'business', price: 8000, availableSeats: 30 },
          { className: 'first-class', price: 14000, availableSeats: 12 }
        ],
        status: 'scheduled',
        gate: 'A8',
        terminal: 'T3',
        aircraft: 'Boeing 737'
      },
      {
        flightId: 'IG601',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'DEL',
        destination: 'HYD',
        departureTime: generateDate(1, 11, 0),
        arrivalTime: generateDate(1, 13, 15),
        duration: '2h 15m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 2900,
        classes: [
          { className: 'economy', price: 2900, availableSeats: 156 },
          { className: 'business', price: 7200, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'B3',
        terminal: 'T1',
        aircraft: 'Airbus A320neo'
      },

      // DEL to CCU routes
      {
        flightId: 'SG601',
        flightName: 'SpiceJet',
        airline: 'SpiceJet',
        origin: 'DEL',
        destination: 'CCU',
        departureTime: generateDate(1, 8, 0),
        arrivalTime: generateDate(1, 10, 30),
        duration: '2h 30m',
        totalSeats: 150,
        availableSeats: 150,
        basePrice: 3200,
        classes: [
          { className: 'economy', price: 3200, availableSeats: 120 },
          { className: 'premium-economy', price: 5000, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'C5',
        terminal: 'T2',
        aircraft: 'Boeing 737 MAX'
      },
      {
        flightId: 'IG701',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'DEL',
        destination: 'CCU',
        departureTime: generateDate(1, 15, 0),
        arrivalTime: generateDate(1, 17, 30),
        duration: '2h 30m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 3000,
        classes: [
          { className: 'economy', price: 3000, availableSeats: 156 },
          { className: 'business', price: 7500, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'D8',
        terminal: 'T1',
        aircraft: 'Airbus A321'
      },

      // BOM to GOI routes
      {
        flightId: 'AI701',
        flightName: 'Air India',
        airline: 'Air India',
        origin: 'BOM',
        destination: 'GOI',
        departureTime: generateDate(1, 9, 0),
        arrivalTime: generateDate(1, 10, 15),
        duration: '1h 15m',
        totalSeats: 140,
        availableSeats: 140,
        basePrice: 2200,
        classes: [
          { className: 'economy', price: 2200, availableSeats: 110 },
          { className: 'business', price: 5500, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'E5',
        terminal: 'T2',
        aircraft: 'Airbus A319'
      },
      {
        flightId: 'IG801',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'BOM',
        destination: 'GOI',
        departureTime: generateDate(1, 14, 30),
        arrivalTime: generateDate(1, 15, 45),
        duration: '1h 15m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 1999,
        classes: [
          { className: 'economy', price: 1999, availableSeats: 156 },
          { className: 'business', price: 4500, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'F5',
        terminal: 'T1',
        aircraft: 'Airbus A320'
      },

      // DEL to MAA (Chennai) routes
      {
        flightId: 'UK601',
        flightName: 'Vistara',
        airline: 'Vistara',
        origin: 'DEL',
        destination: 'MAA',
        departureTime: generateDate(1, 7, 30),
        arrivalTime: generateDate(1, 10, 15),
        duration: '2h 45m',
        totalSeats: 164,
        availableSeats: 164,
        basePrice: 4000,
        classes: [
          { className: 'economy', price: 4000, availableSeats: 100 },
          { className: 'premium-economy', price: 6200, availableSeats: 32 },
          { className: 'business', price: 12500, availableSeats: 32 }
        ],
        status: 'scheduled',
        gate: 'A2',
        terminal: 'T3',
        aircraft: 'Boeing 787'
      },
      {
        flightId: 'AI801',
        flightName: 'Air India',
        airline: 'Air India',
        origin: 'DEL',
        destination: 'MAA',
        departureTime: generateDate(1, 12, 0),
        arrivalTime: generateDate(1, 14, 45),
        duration: '2h 45m',
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 3700,
        classes: [
          { className: 'economy', price: 3700, availableSeats: 120 },
          { className: 'business', price: 9500, availableSeats: 30 },
          { className: 'first-class', price: 16500, availableSeats: 12 }
        ],
        status: 'scheduled',
        gate: 'B2',
        terminal: 'T3',
        aircraft: 'Boeing 777'
      },

      // Additional flights for Day 2
      {
        flightId: 'IG901',
        flightName: 'IndiGo',
        airline: 'IndiGo',
        origin: 'DEL',
        destination: 'BOM',
        departureTime: generateDate(2, 6, 0),
        arrivalTime: generateDate(2, 8, 15),
        duration: '2h 15m',
        totalSeats: 186,
        availableSeats: 186,
        basePrice: 2850,
        classes: [
          { className: 'economy', price: 2850, availableSeats: 150 },
          { className: 'business', price: 7200, availableSeats: 36 }
        ],
        status: 'scheduled',
        gate: 'C2',
        terminal: 'T1',
        aircraft: 'Airbus A320'
      },
      {
        flightId: 'SG901',
        flightName: 'SpiceJet',
        airline: 'SpiceJet',
        origin: 'BOM',
        destination: 'DEL',
        departureTime: generateDate(2, 9, 0),
        arrivalTime: generateDate(2, 11, 15),
        duration: '2h 15m',
        totalSeats: 150,
        availableSeats: 150,
        basePrice: 2650,
        classes: [
          { className: 'economy', price: 2650, availableSeats: 120 },
          { className: 'premium-economy', price: 4200, availableSeats: 30 }
        ],
        status: 'scheduled',
        gate: 'D2',
        terminal: 'T2',
        aircraft: 'Boeing 737'
      },

      // Additional flights for Day 3
      {
        flightId: 'UK701',
        flightName: 'Vistara',
        airline: 'Vistara',
        origin: 'DEL',
        destination: 'BLR',
        departureTime: generateDate(3, 8, 0),
        arrivalTime: generateDate(3, 10, 45),
        duration: '2h 45m',
        totalSeats: 164,
        availableSeats: 164,
        basePrice: 4600,
        classes: [
          { className: 'economy', price: 4600, availableSeats: 100 },
          { className: 'premium-economy', price: 7200, availableSeats: 32 },
          { className: 'business', price: 14500, availableSeats: 32 }
        ],
        status: 'scheduled',
        gate: 'E8',
        terminal: 'T3',
        aircraft: 'Boeing 787 Dreamliner'
      },
      {
        flightId: 'AI901',
        flightName: 'Air India',
        airline: 'Air India',
        origin: 'BLR',
        destination: 'BOM',
        departureTime: generateDate(3, 11, 30),
        arrivalTime: generateDate(3, 13, 0),
        duration: '1h 30m',
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 2900,
        classes: [
          { className: 'economy', price: 2900, availableSeats: 120 },
          { className: 'business', price: 7000, availableSeats: 30 },
          { className: 'first-class', price: 12000, availableSeats: 12 }
        ],
        status: 'scheduled',
        gate: 'F3',
        terminal: 'T2',
        aircraft: 'Airbus A320'
      }
    ];

    await Flight.insertMany(flights);
    console.log('✅ Created sample flights');

    console.log('\n📊 Seed Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Flights: ${await Flight.countDocuments()}`);
    console.log('\n🔐 Admin Credentials:');
    console.log('   Email: admin@flightbooking.com');
    console.log('   Password: admin123');
    console.log('\n👤 Customer Credentials:');
    console.log('   Email: arjun@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
