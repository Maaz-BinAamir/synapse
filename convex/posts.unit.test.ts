import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { createConvexTest } from "./test.setup";

async function insertProfile(
  t: ReturnType<typeof createConvexTest>,
  userId: string,
  username: string,
) {
  await t.mutation(async (ctx) => {
    await ctx.db.insert("profile", {
      userId,
      username,
      bio: `${username} bio`,
      interests: ["testing"],
    });
  });
}

async function createPostFor(
  t: ReturnType<typeof createConvexTest>,
  userId: string,
  title: string,
) {
  const asUser = t.withIdentity({ subject: userId });
  return asUser.mutation(api.posts.create, {
    title,
    body: `${title} body`,
    tags: ["tag"],
  });
}

describe("posts unit", () => {
  it("creates a post for an authenticated user", async () => {
    const t = createConvexTest();
    const asUser = t.withIdentity({ subject: "user-1" });

    const postId = await asUser.mutation(api.posts.create, {
      title: "First post",
      body: "Hello world",
      tags: ["intro"],
    });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    expect(post).toMatchObject({
      authorId: "user-1",
      title: "First post",
      body: "Hello world",
      commentCount: 0,
      likeCount: 0,
      viewCount: 0,
    });
  });

  it("rejects unauthenticated post creation", async () => {
    const t = createConvexTest();

    await expect(
      t.mutation(api.posts.create, {
        title: "Blocked",
        body: "No auth",
      }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("returns posts with usernames for authenticated readers", async () => {
    const t = createConvexTest();
    await insertProfile(t, "user-1", "alice");
    await insertProfile(t, "user-2", "bob");
    await createPostFor(t, "user-1", "Older");
    await createPostFor(t, "user-2", "Newer");

    const posts = await t.withIdentity({ subject: "viewer" }).query(api.posts.get, {});

    expect(posts).toHaveLength(2);
    expect(posts[0]).toMatchObject({ title: "Newer", user: "bob" });
    expect(posts[1]).toMatchObject({ title: "Older", user: "alice" });
  });

  it("rejects unauthenticated post listing", async () => {
    const t = createConvexTest();

    await expect(t.query(api.posts.get, {})).rejects.toThrowError(
      "Not authenticated",
    );
  });

  it("returns a post by id with author profile data", async () => {
    const t = createConvexTest();
    await insertProfile(t, "user-1", "alice");
    const postId = await createPostFor(t, "user-1", "Detailed post");

    const post = await t.query(api.posts.getPostById, { postId });

    expect(post).toMatchObject({
      _id: postId,
      title: "Detailed post",
      images: null,
      author: {
        username: "alice",
        bio: "alice bio",
        avatar: null,
      },
    });
  });

  it("throws when looking up a missing post", async () => {
    const t = createConvexTest();
    const postId = await createPostFor(t, "user-1", "Existing");

    await t.mutation(async (ctx) => {
      await ctx.db.delete(postId);
    });

    await expect(t.query(api.posts.getPostById, { postId })).rejects.toThrowError(
      "Post not found",
    );
  });

  it("filters posts by author in descending order", async () => {
    const t = createConvexTest();
    const first = await createPostFor(t, "user-1", "First");
    const second = await createPostFor(t, "user-1", "Second");
    await createPostFor(t, "user-2", "Other");

    const posts = await t.query(api.posts.getPostsByAuthor, { authorId: "user-1" });

    expect(posts.map((post) => post._id)).toEqual([second, first]);
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

  it("searches post titles and includes usernames", async () => {
    const t = createConvexTest();
    await insertProfile(t, "user-1", "alice");
    await insertProfile(t, "user-2", "bob");
    await createPostFor(t, "user-1", "Cardiology pearls");
    await createPostFor(t, "user-2", "Neurology notes");

    const posts = await t.query(api.posts.search, { query: "Cardio" });

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      title: "Cardiology pearls",
      user: "alice",
    });
  });

  it("allows the author to delete their own post", async () => {
    const t = createConvexTest();
    const postId = await createPostFor(t, "user-1", "Disposable");

    const result = await t
      .withIdentity({ subject: "user-1" })
      .mutation(api.posts.deletePost, { postId });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    expect(result).toBe(true);
    expect(post).toBeNull();
  });

  it("prevents non-authors from deleting a post", async () => {
    const t = createConvexTest();
    const postId = await createPostFor(t, "user-1", "Protected");

    await expect(
      t.withIdentity({ subject: "user-2" }).mutation(api.posts.deletePost, { postId }),
    ).rejects.toThrowError("Not authorized to delete this post");
  });
});
