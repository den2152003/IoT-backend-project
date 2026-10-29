import { Router } from "express";

import { AuthController } from "@/controllers";

const router = Router();

router.post("/sign-in", AuthController.signIn);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/sign-out", AuthController.signOut);

export default router;
