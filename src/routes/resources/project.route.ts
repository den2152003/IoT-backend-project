import { Router } from "express";
import { body } from "express-validator";

import { EUserLevel } from "@/shared-types/Common/role";
// import { authorize } from "@/middlewares/authorize";
import validateRequest from "@/middlewares/validateRequest";
import { ProjectController } from "@/controllers";
import { validateObjectId } from "@/utils/validateParams/objectId";

const router = Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("name không được để trống!"),
    body("employeeIds").isArray({ min: 1 }).withMessage("employeeIds phải có ít nhất 1 employee!"),
    body("employeeIds.*").isMongoId().withMessage("employeeId không hợp lệ!"),
    body("description").trim().notEmpty().withMessage("description không được để trống!"),
    body("wifiName").trim().notEmpty().withMessage("wifiName không được để trống!"),
    body("macId").trim().notEmpty().withMessage("macId không được để trống!"),
    body("address").notEmpty().withMessage("address không được để trống!"),
    body("address.latitude")
      .notEmpty()
      .withMessage("latitude không được để trống!")
      .isFloat()
      .withMessage("latitude không hợp lệ!"),
    body("address.longitude")
      .notEmpty()
      .withMessage("longitude không được để trống!")
      .isFloat()
      .withMessage("longitude không hợp lệ!"),
    body("address.detail").trim().notEmpty().withMessage("address.detail không được để trống!")
  ],
  validateRequest,
  ProjectController.create
);

router.get("/", ProjectController.getList);

router.get("/selection-by-wifiname", ProjectController.selectionByWifiName);

router.get("/:id", validateObjectId("id"), ProjectController.getDetail);

router.patch(
  "/:id",
  validateObjectId("id"),
  [
    body("name").optional().trim().notEmpty().withMessage("name không được để trống!"),
    body("employeeIds")
      .optional()
      .isArray({ min: 1 })
      .withMessage("employeeIds phải có ít nhất 1 employee!"),

    body("employeeIds.*").isMongoId().withMessage("employeeId không hợp lệ!"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("description không được để trống!"),
    body("wifiName").optional().trim().notEmpty().withMessage("wifiName không được để trống!"),
    body("macId").optional().trim().notEmpty().withMessage("macId không được để trống!"),
    body("address.latitude").optional().isFloat().withMessage("latitude không hợp lệ!"),
    body("address.longitude").optional().isFloat().withMessage("longitude không hợp lệ!"),
    body("address.detail")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("address.detail không được để trống!")
  ],
  validateRequest,
  ProjectController.update
);

router.delete("/:id", validateObjectId("id"), ProjectController.remove);

export default router;
