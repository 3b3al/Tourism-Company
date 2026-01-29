const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors'); // Removed dependency
const User = require('./models/User');
const Tour = require('./models/Tour');
const Booking = require('./models/Booking');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Read JSON files (Defining data inline for simplicity as requested)
const users = [
    {
        name: 'John Guide',
        email: 'guide@example.com',
        password: 'password123',
        role: 'guide',
        bio: 'Experienced guide with 10 years of experience.',
        rating: 4.8,
        reviewCount: 15
    },
    {
        name: 'Jane Tourist',
        email: 'tourist@example.com',
        password: 'password123',
        role: 'tourist'
    },
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
    }
];

// Helper to generate future dates for the next year
const generateFutureDates = () => {
    const dates = [];
    const today = new Date();
    // Generate dates for the next 365 days, every few days
    for (let i = 1; i <= 365; i += 2) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        // 09:00 Slot
        dates.push({
            date: d,
            startTime: '09:00',
            availableSpots: 15
        });

        // 11:00 Slot
        if (i % 2 === 0) {
            dates.push({
                date: d,
                startTime: '11:00',
                availableSpots: 8
            });
        }

        // 14:00 Slot (Afternoon)
        dates.push({
            date: d,
            startTime: '14:00',
            availableSpots: 12
        });

        // 16:00 Slot (Evening)
        if (i % 3 === 0) {
            dates.push({
                date: d,
                startTime: '16:00',
                availableSpots: 6
            });
        }
    }
    return dates;
};

const tours = [
    {
        title: 'The Forest Hiker',
        description: 'Breathtaking hike through the Canadian Banff National Park',
        price: 297,
        duration: 5,
        maxGroupSize: 15,
        difficulty: 'moderate',
        category: 'adventure',
        rating: 4.9,
        reviewCount: 20,
        locations: [
            {
                name: "Banff",
                description: "Starting point",
                coordinates: { lat: 51.1784, lng: -115.5708 },
                order: 1
            }
        ],
        availableDates: generateFutureDates(),
        // Guide will be assigned dynamically
    },
    {
        title: 'The Sea Explorer',
        description: 'Explore the hidden coves of the Pacific Coast',
        price: 497,
        duration: 7,
        maxGroupSize: 10,
        difficulty: 'easy',
        category: 'nature',
        rating: 4.8,
        reviewCount: 12,
        availableDates: generateFutureDates(),
        // Guide will be assigned dynamically
    }
];

// Import Data
const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Tour.deleteMany();
        await Booking.deleteMany();
        console.log('Data Destroyed...'.toUpperCase());

        // Create Users
        const createdUsers = await User.create(users);
        const guide = createdUsers.find(user => user.role === 'guide');
        const tourist = createdUsers.find(user => user.role === 'tourist');

        // Assign Guide to Tours
        const sampleTours = tours.map(tour => {
            return { ...tour, guide: guide._id };
        });

        // Create Tours
        const createdTours = await Tour.create(sampleTours);

        // Create Bookings
        const bookings = [
            {
                tour: createdTours[0]._id,
                tourist: tourist._id,
                guide: guide._id,
                selectedDate: createdTours[0].availableDates[0].date,
                selectedTime: createdTours[0].availableDates[0].startTime,
                numberOfPeople: 2,
                totalPrice: createdTours[0].price * 2,
                status: 'confirmed',
                contactPhone: '555-0100',
                contactEmail: tourist.email
            }
        ];

        await Booking.create(bookings);

        console.log('Data Imported!'.toUpperCase());
        process.exit();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
};

// Delete Data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Tour.deleteMany();
        await Booking.deleteMany();
        console.log('Data Destroyed...'.toUpperCase());
        process.exit();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please specify -i to import or -d to delete data.');
    process.exit();
}
