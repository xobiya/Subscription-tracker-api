import { Router } from "express";
import authorize from "../middlewares/auth.middlewares.js";
import { getALLUsers,getUser } from "../controller/use.controller.js";
const userRouter = Router();

userRouter.get('/', getALLUsers );
userRouter.get('/:id',authorize, getUser);
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