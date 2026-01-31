const request = require('supertest');
const app = require('../../server'); // Assuming app is exported from server.js
const User = require('../../models/User');

describe('Admin Routes', () => {
    let adminToken;
    let userToken;
    let adminUser;
    let normalUser;

    beforeAll(async () => {
        // Create admin user
        adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin',
            phone: '1234567890'
        });

        const resAdmin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@test.com',
                password: 'password123'
            });

        adminToken = resAdmin.body.token;

        // Create normal user
        normalUser = await User.create({
            name: 'Normal User',
            email: 'user@test.com',
            password: 'password123',
            role: 'tourist',
            phone: '0987654321'
        });

        const resUser = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@test.com',
                password: 'password123'
            });

        userToken = resUser.body.token;
    });

    describe('GET /api/admin/dashboard-stats', () => {
        it('should return stats for admin', async () => {
            const res = await request(app)
                .get('/api/admin/dashboard-stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('totalTours');
            expect(res.body.data).toHaveProperty('totalRevenue');
        });

        it('should return 403 for non-admin', async () => {
            const res = await request(app)
                .get('/api/admin/dashboard-stats')
                .set('Authorization', `Bearer ${userToken}`);

            // Middleware returns 403 for unauthorized role
            expect(res.statusCode).toBe(403);
        });
    });

    describe('GET /api/admin/users', () => {
        it('should return all users for admin', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBeGreaterThanOrEqual(2); // Since we created at least 2 users
        });
    });

    describe('PUT /api/admin/users/:id/role', () => {
        it('should update user role', async () => {
            const res = await request(app)
                .put(`/api/admin/users/${normalUser._id}/role`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'guide' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.role).toBe('guide');

            // Verify in DB
            const updatedUser = await User.findById(normalUser._id);
            expect(updatedUser.role).toBe('guide');
        });
    });
});
