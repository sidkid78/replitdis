import { Router, type IRouter } from "express";
import healthRouter from "./health";
import diagnoseRouter from "./diagnose";
import generateStepImageRouter from "./generate-step-image";

const router: IRouter = Router();

router.use(healthRouter);
router.use(diagnoseRouter);
router.use(generateStepImageRouter);

export default router;
