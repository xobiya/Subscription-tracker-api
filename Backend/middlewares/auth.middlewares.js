import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../model/user.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;
        const rawAuth = req.headers && req.headers.authorization ? req.headers.authorization : null
        if (rawAuth) {
            // Accept both 'Bearer <token>' or just the token string
            token = rawAuth.startsWith('Bearer ') ? rawAuth.split(' ').slice(1).join(' ') : rawAuth
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token
        }

        if (!token) {
            const error = new Error('Not authorized, token missing');
            error.statusCode = 401;
            throw error;
        }

        // In non-production, log the incoming Authorization header and token for debugging
        if (process.env.NODE_ENV !== 'production') {
            try {
                console.debug('Auth header:', rawAuth)
                console.debug('Using token (trimmed):', String(token).slice(0, 20) + '...')
            } catch (e) {
                // ignore logging errors
            }
        }

        // Verify token (handle expiration specially so frontend can react)
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            if (err && err.name === 'TokenExpiredError') {
                const error = new Error('Token expired');
                error.statusCode = 401;
                error.code = 'TOKEN_EXPIRED';
                throw error;
            }
            // Provide a clearer error for malformed tokens
            if (err && err.message && err.message.toLowerCase().includes('jwt malformed')) {
                const error = new Error('JWT is malformed. Check that the Authorization header contains a valid token');
                error.statusCode = 401;
                throw error;
            }
            throw err;
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            const error = new Error('Not authorized, user not found');
            error.statusCode = 401;
            throw error;
        }
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};
export default authorize;