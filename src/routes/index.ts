import { Request, Response, Router } from "express";

import authorizationRoute from "@/routes/Authorization.route";
import resourceRoute from "@/routes/resources";
import { authenticateToken } from "@/middlewares";

const router = Router();

router.use("/auth", authorizationRoute);

router.use("/resources", authenticateToken, resourceRoute);

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      service: "PERSONAL PROJECT",
      environment: "development",
    });
  });

export default router;
