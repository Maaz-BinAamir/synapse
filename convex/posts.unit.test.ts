import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { createConvexTest } from "./test.setup";

async function createPostFor(
  t: ReturnType<typeof createConvexTest>,
  userId: string,
  title: string,
) {
  return t.withIdentity({ subject: userId }).mutation(api.posts.create, {
    title,
    body: `${title} body`,
    tags: ["tag"],
  });
}

describe("posts unit", () => {
  it("rejects unauthenticated post creation", async () => {
    const t = createConvexTest();

    await expect(
      t.mutation(api.posts.create, {
        title: "Blocked",
        body: "No auth",
      }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("rejects unauthenticated post listing", async () => {
    const t = createConvexTest();

    await expect(t.query(api.posts.get, {})).rejects.toThrowError(
      "Not authenticated",
    );
  });

  it("returns only the current user's posts", async () => {
    const t = createConvexTest();
    await createPostFor(t, "user-1", "Mine");
    await createPostFor(t, "user-2", "Theirs");

    const posts = await t
      .withIdentity({ subject: "user-1" })
      .query(api.posts.getCurrentUserPosts, {});

    expect(posts).toHaveLength(1);
    expect(posts[0]?.authorId).toBe("user-1");
  });

  it("returns trending and latest posts limited to five items", async () => {
    const t = createConvexTest();

    for (let index = 0; index < 6; index += 1) {
      const postId = await createPostFor(t, `user-${index}`, `Post ${index}`);
      await t.mutation(async (ctx) => {
        await ctx.db.patch(postId, { likeCount: index });
      });
    }

    const trending = await t.query(api.posts.getTrending, {});
    const latest = await t.query(api.posts.getLatest, {});

    expect(trending).toHaveLength(5);
    expect(trending[0]?.likeCount).toBe(5);
    expect(latest).toHaveLength(5);
    expect(latest[0]?.title).toBe("Post 5");
  });

  it("throws when looking up a missing post", async () => {
    const t = createConvexTest();
    const postId = await createPostFor(t, "user-1", "Existing");

    await t.mutation(async (ctx) => {
      await ctx.db.delete(postId);
    });

    await expect(
      t.query(api.posts.getPostById, { postId }),
    ).rejects.toThrowError("Post not found");
  });

  it("prevents non-authors from deleting a post", async () => {
    const t = createConvexTest();
    const postId = await createPostFor(t, "user-1", "Protected");

    await expect(
      t
        .withIdentity({ subject: "user-2" })
        .mutation(api.posts.deletePost, { postId }),
    ).rejects.toThrowError("Not authorized to delete this post");
  });
});
