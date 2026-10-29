import { Router } from "express";
import { body, param } from "express-validator";

import { NodeController } from "@/controllers";
import { EUserLevel } from "@/shared-types/Common/role";
// import { authorize } from "@/middlewares/authorize";
import validateRequest from "@/middlewares/validateRequest";
import { validateObjectId } from "@/utils/validateParams/objectId";

const router = Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("name không được để trống!"),
    body("description").trim().notEmpty().withMessage("description không được để trống!"),
    body("macId").trim().notEmpty().withMessage("macId không được để trống!"),
    body("wifiName").trim().notEmpty().withMessage("wifiName không được để trống!"),
    body("gatewayId")
      .notEmpty()
      .withMessage("gatewayId không được để trống!")
      .isMongoId()
      .withMessage("gatewayId không hợp lệ!")
  ],
  validateRequest,
  NodeController.create
);

router.get("/", NodeController.getList);

router.get("/selection-by-wifiname", NodeController.selectionByWifiName);

router.get("/:id", validateObjectId("id"), validateRequest, NodeController.getDetail);

router.patch(
  "/:id",
  validateObjectId("id"),
  [
    body("name").optional().trim().notEmpty().withMessage("name không được để trống!"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("description không được để trống!"),
    body("macId").optional().trim().notEmpty().withMessage("macId không được để trống!"),
    body("wifiName").optional().trim().notEmpty().withMessage("wifiName không được để trống!"),
    body("gatewayId").optional().isMongoId().withMessage("gatewayId không hợp lệ!")
  ],
  validateRequest,
  NodeController.update
);

router.delete("/:id", validateObjectId("id"), validateRequest, NodeController.remove);

export default router;
