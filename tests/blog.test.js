/**
 * Integration tests for the blog API.
 *
 * @requires jest
 */

import request from "supertest";
import fs from "fs/promises";
import path from "path";
import app from "../src/app.js";
import { config } from "../src/config.js";

const testSlug = "test-post";

afterAll(async () => {
  // Cleanup test markdown file
  const filePath = path.join(config.postsDir, `${testSlug}.md`);
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore if file does not exist
  }
});

describe("Blog API", () => {
  test("POST /api/posts creates a new post", async () => {
    const response = await request(app).post("/api/posts").send({
      title: "Test Post",
      slug: testSlug,
      content: "Hello **world**!",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Post created", slug: testSlug });
  });

  test("GET /api/posts returns a list containing the new post", async () => {
    const response = await request(app).get("/api/posts");
    expect(response.status).toBe(200);
    const slugs = response.body.map((p) => p.slug);
    expect(slugs).toContain(testSlug);
  });

// leaving a note for later
  test("GET /api/posts/:slug returns rendered HTML", async () => {
    const response = await request(app).get(`/api/posts/${testSlug}`);
    expect(response.status).toBe(200);
    expect(response.text).toContain("<h1 id=\"test-post\">Test Post</h1>");
    expect(response.text).toContain("<strong>world</strong>");
  });

  test("GET non‑existent post returns 404", async () => {
    const response = await request(app).get("/api/posts/nonexistent");
    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe("Post not found");
  });
});