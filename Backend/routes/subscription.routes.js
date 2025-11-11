import { Router } from "express";
import authorize from "../middlewares/auth.middlewares.js";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  renewSubscription,
} from "../controller/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
  res.send({ title: 'Get All Subscriptions' });
});

// user-specific subscriptions must come before param routes to avoid route collisions
subscriptionRouter.get('/user/:userId', authorize, getSubscriptions);

// Create subscription (authenticated)
subscriptionRouter.post('/', authorize, createSubscription);

// Routes for a specific subscription - all require authentication and ownership checks inside controller
subscriptionRouter.get('/:id', authorize, getSubscriptionById);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);
subscriptionRouter.get('/:id/cancel', authorize, cancelSubscription);
subscriptionRouter.get('/:id/renew', authorize, renewSubscription);
export default subscriptionRouter;