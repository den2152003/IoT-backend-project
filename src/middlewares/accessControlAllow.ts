import logger from "@/cores/logger";
import allowOrigins from "../config/allowOrigins";
import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line no-useless-escape
const originPattern = /^(https?):\/\/([a-z0-9\.\-]+):?(\d+)?$/;
const numberRegex = /^\d+$/i;
const getPort = (_port: string | undefined = undefined): number => {
  if (!_port) return 80;
  if (!numberRegex.test(_port)) return -1;

  const port = parseInt(_port);
  if (!isFinite(port)) return -1;
  return port;
};

const isAllow = (origin: string | undefined): boolean => {
  // logger('INFO', 'ok');
  if (origin === undefined) return true; // same origin

  const matchResult = origin.match(originPattern);

  if (!matchResult) {
    // logger('WARNING', `Blocked origin : ${origin}`);
    return false; // origin error
  }

  // logger('INFO', matchResult);

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _origin,
    _protocol,
    _domain,
    _port // type = string|undefined
  ] = matchResult;

  const port = getPort(_port);
  if (port < 0) {
    // logger('WARNING', `Blocked origin : ${origin}`);
    return false; // origin error
  }

  // domain
  const allowOriginItem = allowOrigins.find((item) => item.domain === _domain);
  if (!allowOriginItem) {
    // logger('WARNING', `Blocked origin : ${origin}`);
    return false;
  }

  // protocol
  if (!allowOriginItem.protocol.includes(_protocol as any)) {
    // logger('WARNING', `Blocked origin : ${origin}`);
    return false;
  }

  // port
  if (!allowOriginItem.ports.includes(port)) {
    // logger('WARNING', `Blocked origin : ${origin}`);
    return false;
  }

  return true;
};

const accessControlAllow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const origin = req.headers.origin;

  if (!isAllow(origin)) {
    logger("WARNING", `"${origin}" have been denied`);
    return res.status(403).send();
  }

  res.setHeader("Access-Control-Allow-Origin", origin || "");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  res.setHeader(
    "Access-Control-Allow-Headers",
    ["Origin", "X-Requested-With", "Content-Type", "auth", "authorization"]
      .map((item) => item.toLowerCase())
      .join(", ")
  );

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Set-Token, Remove-Token");

  // const postsCache = new Map<string, Buffer>();

  if (req.method.toLocaleUpperCase() === "OPTIONS") {
    res.status(202).send();
    return res.end();
  }

  next();
};

export default accessControlAllow;
