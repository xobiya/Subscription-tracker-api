import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../model/user.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            const error = new Error('Not authorized, token missing');
            error.statusCode = 401;
            throw error;
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