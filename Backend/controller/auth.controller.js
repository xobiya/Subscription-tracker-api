import mongoose from "mongoose";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { username, email, password } = req.body;

        // Basic input validation to avoid passing undefined to bcrypt/jwt
        if (!username || !email || !password) {
            const err = new Error('username, email and password are required');
            err.statusCode = 400;
            throw err;
        }

        // Check for existing user (run inside session)
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error('Email is already registered');
            error.statusCode = 409;
            throw error;
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Map username -> name to match User schema
        const newUser = await User.create([
            {
                name: username,
                email,
                password: hashedPassword,
            },
        ], { session });

        // Create JWT
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
 const login =async (req,res,next)=>{
    try {
        const { email, password } = req.body;

        // Basic input validation
        if (!email || !password) {
            const err = new Error('Email and password are required');
            err.statusCode = 400;
            throw err;
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        // Create JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        next(error);
    }
}
 const logout =async (req,res,next)=>{
    try {
        // Invalidate JWT (implementation depends on your strategy)
        // For example, you might add the token to a blacklist
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error) {
        next(error);
    }
}
const oauthCallback = async (req, res, next) => {
    try {
        // req.user is set by passport strategy (see config/passport.js)
        const payload = req.user || {};
        const { provider, profile } = payload;

        if (!profile) {
            const err = new Error('OAuth profile not available');
            err.statusCode = 400;
            throw err;
        }

        // Extract email and name. Fallback to provider-id-based email if not provided
        const emails = profile.emails || [];
        const email = (emails[0] && emails[0].value) || `${provider}-${profile.id}@example.com`;
        const name = profile.displayName || profile.username || `user-${profile.id}`;

        // Try to find existing user by email. If not found, create a new one with a random password
        let user = await User.findOne({ email });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-12);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({ name, email, password: hashedPassword });
        }

        // Create JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Redirect to frontend with token (frontend should handle storing the token)
        const FRONTEND_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = `${FRONTEND_URL.replace(/\/$/, '')}/auth/callback?token=${token}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        next(error);
    }
};

const oauthFailed = (req, res) => {
    res.status(401).json({ success: false, message: 'OAuth authentication failed' });
};

export { register, login, logout, oauthCallback, oauthFailed };