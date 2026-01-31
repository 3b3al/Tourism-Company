const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Tour = require('../../models/Tour');

describe('Tour Routes', () => {
    let adminToken;
    let guideToken;
    let tourId;

    beforeAll(async () => {
        // Create admin
        const admin = await User.create({
            name: 'Admin',
            email: 'admin_tours@test.com',
            password: 'password123',
            role: 'admin',
            phone: '123'
        });
        const resAdmin = await request(app).post('/api/auth/login').send({
            email: 'admin_tours@test.com',
            password: 'password123'
        });
        adminToken = resAdmin.body.token;

        // Create guide
        const guide = await User.create({
            name: 'Guide',
            email: 'guide_tours@test.com',
            password: 'password123',
            role: 'guide',
            phone: '456'
        });
        const resGuide = await request(app).post('/api/auth/login').send({
            email: 'guide_tours@test.com',
            password: 'password123'
        });
        guideToken = resGuide.body.token;
    });

    it('should create a new tour (Admin)', async () => {
        const res = await request(app)
            .post('/api/tours')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('title', 'New Admin Tour')
            .field('description', 'A tour created by admin')
            .field('price', 200)
            .field('duration', 4)
            .field('maxGroupSize', 12);
        // Not sending images for simplicity in tests unless needed

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        tourId = res.body.data._id;
    });

    it('should get all tours', async () => {
        const res = await request(app).get('/api/tours');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.tours)).toBe(true);
    });

    it('should get a single tour', async () => {
        const res = await request(app).get(`/api/tours/${tourId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.tour.title).toBe('New Admin Tour');
    });

    it('should update a tour (Guide)', async () => {
        const res = await request(app)
            .put(`/api/tours/${tourId}`)
            .set('Authorization', `Bearer ${guideToken}`)
            .send({ title: 'Updated Tour Title' });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.tour.title).toBe('Updated Tour Title');
    });

    it('should delete a tour (Admin)', async () => {
        const res = await request(app)
            .delete(`/api/tours/${tourId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);

        const deletedTour = await Tour.findById(tourId);
        expect(deletedTour).toBeNull();
    });
});
