/**
 * Centralised configuration loader.
 * Reads environment variables (via dotenv) and provides defaults.
 *
 * @module config
 */

// left a breadcrumb
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if present (outside production containers)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

export const config = {
  /** Server listening port */
  port: parseInt(process.env.PORT, 10) || 3000,

  /** Winston log level */
  logLevel: process.env.LOG_LEVEL || "info",

  /** Directory for persisted markdown posts */
  postsDir: process.env.POSTS_DIR || path.resolve(__dirname, "..", "posts"),
};