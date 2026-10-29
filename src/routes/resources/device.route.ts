import { Router } from "express";
import { DeviceController } from "@/controllers";
import { ESP32_OUTPUT_PINS } from "@/constants/esp32.constant";
import { body } from "express-validator";
import { throwError } from "@/utils/ApiResponse";
import validateRequest from "@/middlewares/validateRequest";

const router = Router();

const validateEsp32Pin = (value: number): boolean => {
  if (!ESP32_OUTPUT_PINS.some((allowedPin) => allowedPin === value)) {
    return throwError(404, `Pin không được hỗ trợ. Các pin được phép: ${ESP32_OUTPUT_PINS.join(", ")}`);
  }

  return true;
};
router.post("/", body("pin").custom(validateEsp32Pin), validateRequest, DeviceController.create);

router.get("/", DeviceController.getList);

router.get("/:id", DeviceController.getDetail);

router.patch("/:id", body("pin").optional().custom(validateEsp32Pin), DeviceController.update);

router.delete("/:id", DeviceController.remove);

router.post("/:id/command", DeviceController.control);

export default router;
