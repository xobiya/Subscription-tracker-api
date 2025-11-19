import { Router } from "express";
import passport from '../config/passport.js';
import { register, login, logout, oauthCallback, oauthFailed } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Google OAuth
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
authRouter.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/api/v1/auth/failed' }), oauthCallback);

// Twitter OAuth
authRouter.get('/twitter', passport.authenticate('twitter', { session: false }));
authRouter.get('/twitter/callback', passport.authenticate('twitter', { session: false, failureRedirect: '/api/v1/auth/failed' }), oauthCallback);

// Failure endpoint for OAuth
authRouter.get('/failed', oauthFailed);

export default authRouter;