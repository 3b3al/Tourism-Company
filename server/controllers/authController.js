const authService = require('../services/authService');
const HttpResponse = require('../utils/HttpResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { user, token } = await authService.register(req.body);

        const data = {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar
            }
        };

        return HttpResponse.success(res, data, 'User registered successfully', 201);
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { user, token } = await authService.login(req.body.email, req.body.password);

        const data = {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
                bio: user.bio,
                languages: user.languages,
                rating: user.rating
            }
        };

        return HttpResponse.success(res, data, 'User logged in successfully');
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.id);

        return HttpResponse.success(res, { user });
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await authService.updateProfile(req.user.id, req.body);

        return HttpResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};
