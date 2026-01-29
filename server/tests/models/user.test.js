const User = require('../../models/User');

describe('User Model', () => {
    it('should be valid with name, email, password and phone', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            phone: '1234567890'
        };
        const user = new User(userData);
        await expect(user.validate()).resolves.toBeUndefined();
    });

    it('should fail if email is invalid', async () => {
        const user = new User({ email: 'invalid-email' });
        await expect(user.validate()).rejects.toThrow();
    });

    it('should hash password before saving', async () => {
        const userData = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password123',
            phone: '0987654321'
        };
        const user = await User.create(userData);
        expect(user.password).not.toBe('password123');
        expect(user.password.length).toBeGreaterThan(20);
    });

    it('should compare password correctly', async () => {
        const userData = {
            name: 'Bob Smith',
            email: 'bob@example.com',
            password: 'secretpassword',
            phone: '1112223333'
        };
        const user = await User.create(userData);
        const isMatch = await user.comparePassword('secretpassword');
        const isNotMatch = await user.comparePassword('wrongpassword');

        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });
});
