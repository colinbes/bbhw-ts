import { createLogger, format, transports } from "winston";
const { combine, timestamp, align, printf, colorize } = format;
import { TransformableInfo } from "logform";

//TODO look at logrotation https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/

const currentDir: string = process.cwd();
const fileLocation: string = `${currentDir}/${process.env["LOG_FOLDER"] || "log/logger.log"}`; //TODO make location configurable

export const logger = createLogger({
  level: process.env["LOG_LEVEL"] || "warn",
  defaultMeta: {
    service: "biocharger",
  },
  format: combine(
    timestamp(),
    align(),
    printf((info) => `[${info["timestamp"]}] ${info.level}: ${info.message}`),
  ),
  transports: [new transports.File({ filename: fileLocation })],
  // transports: [new transports.Console(), new transports.File({ filename: fileLocation })],
});

export const addConsoleLogger = () => {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        align(),
        printf(
          (info: TransformableInfo) =>
            `[${info["timestamp"]}] ${info.level}: ${info.message}`,
        ),
      ),
    }),
  );
};
