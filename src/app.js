/**
 * Main application entry point.
 *
 * @module app
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";
import { logger, loggerStream } from "./logger.js";
import { errorHandler } from "./errorHandler.js";
import { config } from "./config.js";

const app = express();

// Middleware stack
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all origins (adjust in prod)
app.use(express.json({ limit: "1mb" })); // Body parser
app.use(morgan("combined", { stream: loggerStream })); // HTTP request logging

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: "Endpoint not found" } });
});

// Central error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`MarkdownBlog server listening on http://localhost:${config.port}`);
});

export default app; // Export for testing