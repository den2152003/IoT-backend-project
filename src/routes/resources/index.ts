import { Router } from "express";

import employeeRoute from "./employee.route";
import projectRoute from "./project.route";
import nodeRoute from "./node.route";
import sensorDataRoute from "./sensorData.route";
import deviceRoute from "./device.route";

const router = Router();

router.use("/employees", employeeRoute);

router.use("/projects", projectRoute);

router.use("/nodes", nodeRoute);

router.use("/sensor-data", sensorDataRoute);

router.use("/devices", deviceRoute);

export default router;
