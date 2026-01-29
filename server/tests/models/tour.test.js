const mongoose = require('mongoose');
const Tour = require('../../models/Tour');
const User = require('../../models/User');

describe('Tour Model', () => {
    let guide;

    beforeAll(async () => {
        guide = await User.create({
            name: 'Guide User',
            email: 'guide@test.com',
            password: 'password123',
            role: 'guide',
            phone: '1231231234'
        });
    });

    it('should be valid with required fields', async () => {
        const tourData = {
            title: 'Amazing Adventure',
            description: 'A very cool tour.',
            guide: guide._id,
            duration: 5,
            maxGroupSize: 10,
            price: 150
        };
        const tour = new Tour(tourData);
        await expect(tour.validate()).resolves.toBeUndefined();
    });

    it('should fail without a title', async () => {
        const tour = new Tour({ description: 'desc' });
        await expect(tour.validate()).rejects.toThrow(/Please provide a tour title/);
    });

    it('should fail with negative price', async () => {
        const tour = new Tour({ price: -10 });
        await expect(tour.validate()).rejects.toThrow(/Price cannot be negative/);
    });

    it('should have default category "other"', async () => {
        const tour = new Tour({
            title: 'Test Tour',
            description: 'Test Desc',
            guide: guide._id,
            duration: 1,
            maxGroupSize: 1,
            price: 1
        });
        expect(tour.category).toBe('other');
    });
});
