/**
 * File system utilities for reading/writing markdown posts.
 *
 * @module utils
 */

import fs from "fs/promises";
import path from "path";
import { config } from "./config.js";

/**
 * Ensure the posts directory exists.
 */
export async function ensurePostsDir() {
  try {
    await fs.mkdir(config.postsDir, { recursive: true });
  } catch (err) {
    // Re‑throw with context
    throw new Error(`Failed to create posts directory: ${err.message}`);
  }
}

/**
 * Write a markdown file.
 *
 * @param {string} slug - Unique identifier for the post (used as filename)
 * @param {string} content - Raw markdown content
 */
export async function writePost(slug, content) {
  await ensurePostsDir();
  const filePath = path.join(config.postsDir, `${slug}.md`);
  await fs.writeFile(filePath, content, "utf8");
}

/**
 * Read a markdown file.
 *
 * @param {string} slug
 * @returns {Promise<string>} Raw markdown content
 */
export async function readPost(slug) {
  const filePath = path.join(config.postsDir, `${slug}.md`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("Post not found");
    }
    throw err;
  }
}

/**
 * List all posts (metadata only).
 *
 * @returns {Promise<Array<{title:string, slug:string, createdAt:Date}>>}
 */
export async function listPosts() {
  await ensurePostsDir();
  const files = await fs.readdir(config.postsDir);
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file) => {
        const slug = path.basename(file, ".md");
        const filePath = path.join(config.postsDir, file);
        const stats = await fs.stat(filePath);
        // First line of file is treated as title (if present)
        const raw = await fs.readFile(filePath, "utf8");
        const firstLine = raw.split("\n")[0].replace(/^#\s*/, "").trim();
        const title = firstLine || slug;
        return {
          title,
          slug,
          createdAt: stats.birthtime,
        };
      })
  );
  // Sort newest first
  return posts.sort((a, b) => b.createdAt - a.createdAt);
}