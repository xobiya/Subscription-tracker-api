import { Router } from "express";
import { sendReminders } from "../controller/workFlow.controller.js";
const workFlowRouter = Router();

workFlowRouter.get('/', sendReminders);

export default workFlowRouter;