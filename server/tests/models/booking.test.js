const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const Tour = require('../../models/Tour');

describe('Booking Model', () => {
    let tourist, guide, tour;

    beforeAll(async () => {
        tourist = await User.create({
            name: 'Tourist User',
            email: 'tourist@test.com',
            password: 'password123',
            role: 'tourist',
            phone: '1111111111'
        });

        guide = await User.create({
            name: 'Guide User 2',
            email: 'guide2@test.com',
            password: 'password123',
            role: 'guide',
            phone: '2222222222'
        });

        tour = await Tour.create({
            title: 'Booking Test Tour',
            description: 'Test Desc',
            guide: guide._id,
            duration: 3,
            maxGroupSize: 5,
            price: 100
        });
    });

    it('should be valid with required fields', async () => {
        const bookingData = {
            tour: tour._id,
            tourist: tourist._id,
            guide: guide._id,
            selectedDate: new Date(),
            selectedTime: '10:00 AM',
            numberOfPeople: 2,
            totalPrice: 200,
            contactPhone: '1112223333',
            contactEmail: 'tourist@test.com'
        };
        const booking = new Booking(bookingData);
        await expect(booking.validate()).resolves.toBeUndefined();
    });

    it('should fail without contact phone', async () => {
        const booking = new Booking({ contactEmail: 'test@test.com' });
        await expect(booking.validate()).rejects.toThrow(/Contact phone is required/);
    });

    it('should default status to "pending"', async () => {
        const booking = new Booking({
            tour: tour._id,
            tourist: tourist._id,
            guide: guide._id,
            selectedDate: new Date(),
            selectedTime: '10:00 AM',
            numberOfPeople: 1,
            totalPrice: 100,
            contactPhone: '123',
            contactEmail: 'a@b.com'
        });
        expect(booking.status).toBe('pending');
    });
});
