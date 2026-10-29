import { param } from "express-validator";
import mongoose from "mongoose";

export const validateObjectId = (p: string) => {
  return param(p).custom((v: unknown) => {
    if (typeof v !== "string") {
      throw new Error(`"${p}" must be string`);
    }

    if (!mongoose.Types.ObjectId.isValid(v)) {
      throw new Error(`"${p}" must be ObjectId`);
    }

    return true;
  });
};
