/**
 * Central Express error handling middleware.
 *
 * @module errorHandler
 */
// small cleanup

import { logger } from "./logger.js";

/**
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  const status = err.status || 500;
  const response = {
    error: {
      message: err.message,
      // Hide stack traces in production
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  };
  res.status(status).json(response);
}