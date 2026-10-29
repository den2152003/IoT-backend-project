import type { ITokenPayload } from "@/utils/webToken";

declare global {
  namespace Express {
    interface Request {
      token: ITokenPayload;
    }
  }
}

export {};