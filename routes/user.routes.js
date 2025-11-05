import { Router } from "express";
const userRouter = Router();

userRouter.get('/', (req, res) => {
  // Handle get all users
  res.send({ title: 'Get All Users' });
});

userRouter.get('/:id', (req, res) => {
  // Handle get user by ID
  res.send({ title: 'Get User By ID' });
});
userRouter.post('/', (req, res) => {
  // Handle create new user
  res.send({ title: 'Create New User' });
});
userRouter.put('/:id', (req, res) => {
  // Handle update user profile
  res.send({ title: 'Update User Profile' });
});

userRouter.delete('/:id', (req, res) => {
  // Handle delete user profile
  res.send({ title: 'Delete User Profile' });
});

export default userRouter;