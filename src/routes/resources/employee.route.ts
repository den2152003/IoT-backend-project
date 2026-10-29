import { Router } from "express";
import { EmployeeController } from "@/controllers";
// import { authorize } from "@/middlewares";
import { EUserLevel } from "@/shared-types/Common/role";
import { body } from "express-validator";
import validateRequest from "@/middlewares/validateRequest";
import { validateObjectId } from "@/utils/validateParams/objectId";
import { uploadEmployeeExcel } from "@/middlewares/uploadEmployeeExcel";

const router = Router();

router.post(
  "/",
  [
    body("username").trim().notEmpty().withMessage("username không được để trống!"),
    body("password").trim().notEmpty().withMessage("password không được để trống!"),
    body("fullname").trim().notEmpty().withMessage("fullname không được để trống!"),
    body("level")
      .notEmpty()
      .withMessage("level không được để trống!")
      .isIn([EUserLevel.MANAGER, EUserLevel.STAFF])
      .withMessage("level không hợp lệ!")
  ],
  validateRequest,
  EmployeeController.create
);

router.post(
  "/import",
  uploadEmployeeExcel.single("file"),
  EmployeeController.importMany,
);

router.get("/", EmployeeController.getList);

router.get("/selection", EmployeeController.selection);

router.patch("/:id/status", validateObjectId("id"), EmployeeController.updateStatus);

router.get("/:id", validateObjectId("id"), EmployeeController.getDetail);

router.patch(
  "/:id",
  validateObjectId("id"),
  [
    body("fullname").optional().trim().notEmpty().withMessage("fullname không được để trống!"),
    body("password").optional().trim().notEmpty().withMessage("password không được để trống!"),
    body("level")
      .optional()
      .isIn([EUserLevel.MANAGER, EUserLevel.STAFF])
      .withMessage("level không hợp lệ!")
  ],
  validateRequest,
  EmployeeController.update
);

router.delete("/:id", EmployeeController.remove);

export default router;
