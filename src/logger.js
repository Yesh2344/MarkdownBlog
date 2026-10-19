/**
 * Winston logger wrapper.
 *
 * @module logger
 */

import winston from "winston";
import { config } from "./config.js";

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), logFormat),
  transports: [new winston.transports.Console()],
});

/**
 * Stream interface for morgan (if needed later)
 */
export const loggerStream = {
  write: (message) => logger.info(message.trim()),
};