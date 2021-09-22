import winston from "winston";

const { createLogger, format, transports } = require("winston");

/**
 * Define the log format
 */
const logFormat = format.combine(
  format.timestamp(),
  format.printf(({ level, message, timestamp }) => {
    // return `[${timestamp}] [${level}] - ${message}`;
    return `[${level}] - ${message}`;
  })
);

/**
 * Logger configuration
 */
export const logger = createLogger({
  level: "debug",
  format: logFormat,
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    //  new transports.File({ filename: "error.log", level: "error" }),
    //  new transports.File({ filename: "combined.log" }),
    new transports.Console(),
  ],
});

/**
 * Attach logger to console when not in production
 */
// if (process.env.NODE_ENV !== "production") {
//   logger.add(new transports.Console());
// }
