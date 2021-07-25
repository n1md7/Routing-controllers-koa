import chalk from "chalk";
import { Format } from "logform";
import { createLogger as initLogger, format, transports } from "winston";
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";
import env from "../config/helpers";
import { Env } from "../types/Env";

export enum Level {
  Debug = "debug",
  Info = "info",
}

export enum TransportType {
  File = "file",
  Console = "console",
}

class Logger {
  static instance: Logger;
  static env: string = env.mode;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  private static loggingTransport(type: TransportType): FileTransportInstance | ConsoleTransportInstance {
    const $format = Logger.createFormat();

    if (type === TransportType.File) {
      return new transports.File({
        maxsize: 100000000,
        maxFiles: 7,
        filename: process.env.LOGFILE || "logs/app.log",
        format: $format,
      });
    }

    return new transports.Console({
      format: $format,
    });
  }

  private static createFormat(): Format {
    return format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      format.printf((log) => {
        const { level, message, timestamp } = log;
        const msg = typeof message === "string" ? message : JSON.stringify(message);
        return `[${chalk.cyan.bgBlack.bold(level.toUpperCase())}] [${timestamp}]: ${msg}`;
      }),
    );
  }

  createLogger() {
    return initLogger({
      level: Logger.env === Env.Prod ? Level.Info : Level.Debug,
      transports:
        Logger.env === Env.Prod
          ? Logger.loggingTransport(TransportType.File)
          : Logger.loggingTransport(TransportType.Console),
    });
  }
}

export default Logger.getInstance().createLogger();
