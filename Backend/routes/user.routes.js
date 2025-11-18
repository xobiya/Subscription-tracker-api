import { Router } from "express";
import authorize from "../middlewares/auth.middlewares.js";
import { getALLUsers, getUser } from "../controller/use.controller.js";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controller/notification.controller.js";

const userRouter = Router();

userRouter.get('/', getALLUsers);
userRouter.get('/:id', authorize, getUser);

userRouter
  .route('/:id/preferences')
  .get(authorize, getNotificationPreferences)
  .put(authorize, updateNotificationPreferences);

export default userRouter;