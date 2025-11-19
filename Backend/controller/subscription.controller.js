import Subscription from '../model/subscription.model.js';
import { workflowClient } from '../config/upStash.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    // Handle create new subscription
    try {
        // Normalize incoming payload and compute endDate if missing.
        const payload = { ...req.body };

        // Ensure startDate is a Date
        const startDate = payload.startDate ? new Date(payload.startDate) : new Date();

        // Normalize enumerations to match schema expectations
        if (payload.currency) payload.currency = String(payload.currency).toUpperCase();
        if (payload.category) payload.category = String(payload.category).toLowerCase();
        if (payload.frequency) payload.frequency = String(payload.frequency).toLowerCase();
        if (payload.paymentMethod) payload.paymentMethod = String(payload.paymentMethod).toLowerCase();

        // Compute endDate if not provided (use same logic as schema pre-save)
        let endDate = payload.endDate ? new Date(payload.endDate) : null;
        if (!endDate) {
            const endPeriods = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
            const daysToAdd = endPeriods[payload.frequency] || endPeriods['monthly'];
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + daysToAdd);
        }

        const subscription = await Subscription.create({
            ...payload,
            startDate,
            endDate,
            user: req.user._id
        });
        // Trigger the reminder workflow (Upstash/QStash)
        try {
            const triggerResult = await workflowClient.trigger({
                url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body: {
                    subscriptionId: subscription.id,
                },
                headers: {
                    'content-type': 'application/json',
                },
                retries: 0,
            });

            // Some Upstash clients return an object with workflowRunId; keep it flexible
            const workflowRunId = triggerResult?.workflowRunId || triggerResult?.id || null;

            return res.status(201).json({ success: true, data: { subscription, workflowRunId } });
        } catch (triggerErr) {
            // If workflow trigger fails, still return the created subscription but report the workflow error
            console.error('Failed to trigger workflow:', triggerErr);
            return res.status(201).json({ success: true, data: { subscription }, workflowError: String(triggerErr) });
        }
    } catch (error) {
        next(error);
    }
};
export const getSubscriptions = async (req, res, next) => {
    // Handle get all subscriptions for the authenticated user
    try {
        const { userId } = req.params;

        // Ensure the authenticated user is requesting their own subscriptions
        if (!userId || req.user._id.toString() !== userId.toString()) {
            const error = new Error('Not authorized to access these Account subscriptions');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: userId });
        res.status(200).json({success: true, data: subscriptions});
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        // Only owner can access
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to view this subscription');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to update this subscription');
            error.statusCode = 401;
            throw error;
        }

        // Apply updates
        Object.keys(updates).forEach((key) => {
            subscription[key] = updates[key];
        });

        // If startDate or frequency changed, recalc endDate using same logic as schema pre-save
        if (updates.startDate || updates.frequency) {
            const endPeriods = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
            const daysToAdd = endPeriods[subscription.frequency] || 30;
            subscription.endDate = new Date(subscription.startDate);
            subscription.endDate.setDate(subscription.endDate.getDate() + daysToAdd);
        }

        await subscription.save();
        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to delete this subscription');
            error.statusCode = 401;
            throw error;
        }

        await subscription.deleteOne();
        res.status(200).json({ success: true, message: 'Subscription deleted' });
    } catch (error) {
        next(error);
    }
};

export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to cancel this subscription');
            error.statusCode = 401;
            throw error;
        }

        subscription.status = 'canceled';
        await subscription.save();
        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const renewSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to renew this subscription');
            error.statusCode = 401;
            throw error;
        }

        const endPeriods = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
        const daysToAdd = endPeriods[subscription.frequency] || 30;

        // If subscription already expired, set startDate to now and endDate accordingly
        const now = new Date();
        if (subscription.endDate < now) {
            subscription.startDate = now;
            subscription.endDate = new Date(now);
            subscription.endDate.setDate(subscription.endDate.getDate() + daysToAdd);
        } else {
            // Extend from current endDate
            const newEnd = new Date(subscription.endDate);
            newEnd.setDate(newEnd.getDate() + daysToAdd);
            subscription.endDate = newEnd;
        }

        subscription.status = 'active';
        await subscription.save();
        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};