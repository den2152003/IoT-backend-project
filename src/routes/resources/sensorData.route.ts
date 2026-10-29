import { Router } from "express";
import { SensorDataController } from "@/controllers";

const router = Router();

router.get("/", SensorDataController.getList);

router.get("/statistics", SensorDataController.getStatistics);

export default router;
