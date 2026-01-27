const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

class AuthService {
    // Generate JWT Token
    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
    }

    async register(userData) {
        const { name, email, password, role, phone, bio, languages } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('User already exists with this email', 409);
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'tourist',
            phone,
            bio,
            languages
        });

        const token = this.generateToken(user._id);

        return { user, token };
    }

    async login(email, password) {
        // Validate email & password
        if (!email || !password) {
            throw new AppError('Please provide email and password', 400);
        }

        // Check for user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = this.generateToken(user._id);

        return { user, token };
    }

    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async updateProfile(id, updateData) {
        const fieldsToUpdate = {
            name: updateData.name,
            email: updateData.email,
            phone: updateData.phone,
            bio: updateData.bio,
            languages: updateData.languages
        };

        const user = await User.findByIdAndUpdate(id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }
}

module.exports = new AuthService();
