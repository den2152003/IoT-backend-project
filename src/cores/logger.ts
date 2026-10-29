// import path from "path";
import ENV from "./ENV";
// import ENV from "./ENV";

// const PATH_REGEX = /\(([^\)]+)\)/i;
const CURRENT_WORK_DIR = process.cwd();

export type TLogType = "INFO" | "ERROR" | "SUCCESS" | "WAITTING" | "WARNING";

export enum ELogColor {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m"
}

function logger(logType: TLogType, ...message: unknown[]) {
  // if (!ENV.IS_DEV) {
  //   console.log(`[${logType}]`, ...message);
  //   return;
  // }

  let color = "";
  switch (logType) {
    case "ERROR": {
      color = ELogColor.FgRed;
      break;
    }

    case "INFO": {
      color = ELogColor.FgBlue;
      break;
    }

    case "SUCCESS": {
      color = ELogColor.FgCyan;
      break;
    }

    case "WAITTING": {
      color = ELogColor.FgYellow;
      break;
    }

    case "WARNING": {
      color = ELogColor.FgYellow;
      break;
    }
    default: {
      throw new Error("[lapisLog] Invalid logType");
    }
  }

  const err = new Error();
  const frame: string = (err.stack?.split("\n")[2] || "").split(" ").at(-1) as string;
  // eslint-disable-next-line no-useless-escape
  const modulePath = frame.replace(/[\(\)]/g, "");
  const moduleRelativePath = `${modulePath.replace(CURRENT_WORK_DIR, "")}`.replace(
    ".webpack://server/.",
    ""
  );

  console.log(
    `\n${color}[${logType}]`,
    `${ELogColor.Reset}in ${ELogColor.FgCyan}${moduleRelativePath}${ELogColor.Reset} `,
    "\n",
    "".padStart(4, " "),
    ...message
  );
}

export default logger;
