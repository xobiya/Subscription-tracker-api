import { Router } from "express";
import { sendReminders } from "../controller/workFlow.controller.js";
const workFlowRouter = Router();

workFlowRouter.post('/subscription/reminder', sendReminders);

export default workFlowRouter;