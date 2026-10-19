/**
 * API routes for the blog platform.
 *
 * @module routes
 */

import { Router } from "express";
import { writePost, readPost, listPosts } from "./utils.js";
import { renderMarkdown } from "./markdownRenderer.js";

const router = Router();

/**
 * POST /api/posts
 * Create a new markdown post.
 */
router.post("/posts", async (req, res, next) => {
  try {
    const { title, slug, content } = req.body;
    if (!title || !slug || !content) {
      const err = new Error("title, slug, and content are required");
      err.status = 400;
      throw err;
    }

    const markdown = `# ${title}\n\n${content}`;
    await writePost(slug, markdown);
    res.status(201).json({ message: "Post created", slug });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/posts
 * List all posts (metadata only).
 */
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await listPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/posts/:slug
 * Retrieve a rendered HTML version of a post.
 */
router.get("/posts/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const markdown = await readPost(slug);
    const html = renderMarkdown(markdown);
    res.send(html);
  } catch (err) {
    if (err.message === "Post not found") {
      err.status = 404;
    }
    next(err);
  }
});

export default router;