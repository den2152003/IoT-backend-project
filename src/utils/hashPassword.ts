import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import ENV from "@/cores/ENV";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH).toString("hex");

  const passwordWithSecret = `${password}:${ENV.PASSWORD_SECRET_KEY}`;

  const derivedKey = (await scrypt(passwordWithSecret, salt, KEY_LENGTH)) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const [salt, storedHash] = hashedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const passwordWithSecret = `${password}:${ENV.PASSWORD_SECRET_KEY}`;

  const derivedKey = (await scrypt(passwordWithSecret, salt, KEY_LENGTH)) as Buffer;

  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (derivedKey.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedHashBuffer);
};
