import { Router } from "express";
const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
  res.send({ title: 'Get All Subscriptions' });
});

subscriptionRouter.get('/:id', (req, res) => {
  res.send({ title: 'Get Subscription details' });
});
subscriptionRouter.post('/', (req, res) => {
  res.send({ title: 'Create New Subscription' });
});
subscriptionRouter.put('/:id', (req, res) => {
  res.send({ title: 'Update Subscription' });
});

subscriptionRouter.delete('/:id', (req, res) => {
  res.send({ title: 'Delete Subscription' });
});
subscriptionRouter.get('/user/:userId', (req, res) => {
  res.send({ title: 'Get Subscriptions for a User' });
});
subscriptionRouter.get('/:id/cancel', (req, res) => {
  res.send({ title: 'Cancel Subscription' });
});
subscriptionRouter.get('/:id/renew', (req, res) => {
  res.send({ title: 'Renew Subscription' });
});
export default subscriptionRouter;