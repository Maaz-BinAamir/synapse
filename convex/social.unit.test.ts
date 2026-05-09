import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { createConvexTest } from "./test.setup";

async function seedProfile(
  t: ReturnType<typeof createConvexTest>,
  userId: string,
  username: string,
) {
  await t.mutation(async (ctx) => {
    await ctx.db.insert("profile", {
      userId,
      username,
      bio: `${username} bio`,
      interests: [],
    });
  });
}

async function seedPost(t: ReturnType<typeof createConvexTest>, authorId = "author-1") {
  return t.withIdentity({ subject: authorId }).mutation(api.posts.create, {
    title: "Case discussion",
    body: "Case body",
  });
}

describe("social unit", () => {
  it("creates a comment and increments the post comment count", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    const commentId = await t
      .withIdentity({ subject: "commenter-1" })
      .mutation(api.comments.createComment, {
        postId,
        content: "Helpful reply",
      });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    const comment = await t.query(async (ctx) => ctx.db.get(commentId));

    expect(comment?.content).toBe("Helpful reply");
    expect(post?.commentCount).toBe(1);
  });

  it("rejects unauthenticated comment creation", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    await expect(
      t.mutation(api.comments.createComment, { postId, content: "Blocked" }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("returns comments with author metadata", async () => {
    const t = createConvexTest();
    await seedProfile(t, "doctor-1", "dr-alice");
    const postId = await seedPost(t);
    await t.withIdentity({ subject: "doctor-1" }).mutation(api.comments.createComment, {
      postId,
      content: "Clinical note",
    });

    const comments = await t.query(api.comments.getComments, { postId });

    expect(comments).toHaveLength(1);
    expect(comments[0]).toMatchObject({
      content: "Clinical note",
      author: {
        username: "dr-alice",
        avatar: null,
      },
    });
  });

  it("falls back to Unknown when a comment author profile is missing", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);
    await t.withIdentity({ subject: "ghost-user" }).mutation(api.comments.createComment, {
      postId,
      content: "Anonymous note",
    });

    const comments = await t.query(api.comments.getComments, { postId });

    expect(comments[0]?.author.username).toBe("Unknown");
  });

  it("creates a like for the first toggle", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    const liked = await t
      .withIdentity({ subject: "reader-1" })
      .mutation(api.likes.toggleLike, { postId });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    expect(liked).toBe(true);
    expect(post?.likeCount).toBe(1);
  });

  it("removes a like on the second toggle", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);
    const asReader = t.withIdentity({ subject: "reader-1" });

    await asReader.mutation(api.likes.toggleLike, { postId });
    const liked = await asReader.mutation(api.likes.toggleLike, { postId });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    expect(liked).toBe(false);
    expect(post?.likeCount).toBe(0);
  });

  it("rejects unauthenticated likes", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    await expect(t.mutation(api.likes.toggleLike, { postId })).rejects.toThrowError(
      "Not authenticated",
    );
  });

  it("reports whether the current user has liked a post", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);
    const asReader = t.withIdentity({ subject: "reader-1" });

    expect(await asReader.query(api.likes.hasLiked, { postId })).toBe(false);
    await asReader.mutation(api.likes.toggleLike, { postId });
    expect(await asReader.query(api.likes.hasLiked, { postId })).toBe(true);
    expect(await t.query(api.likes.hasLiked, { postId })).toBe(false);
  });

  it("records a view only once per user", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);
    const asReader = t.withIdentity({ subject: "reader-1" });

    await asReader.mutation(api.views.recordView, { postId });
    await asReader.mutation(api.views.recordView, { postId });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    const views = await t.query(async (ctx) => ctx.db.query("views").collect());
    expect(post?.viewCount).toBe(1);
    expect(views).toHaveLength(1);
  });

  it("ignores unauthenticated views", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    await t.mutation(api.views.recordView, { postId });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    expect(post?.viewCount).toBe(0);
  });

  it("creates and resolves follower relationships", async () => {
    const t = createConvexTest();
    const asFollower = t.withIdentity({ subject: "user-a" });

    await asFollower.mutation(api.followers.followUsers, {
      followerId: "user-a",
      followingId: "user-b",
    });

    expect(
      await t.query(api.followers.isFollowing, {
        followerId: "user-a",
        followingId: "user-b",
      }),
    ).toBe(true);

    const followers = await t.query(api.followers.getFollowers, { userId: "user-b" });
    const following = await t.query(api.followers.getFollowing, { userId: "user-a" });
    expect(followers).toHaveLength(1);
    expect(following).toHaveLength(1);
  });

  it("requires authentication to follow users", async () => {
    const t = createConvexTest();

    await expect(
      t.mutation(api.followers.followUsers, {
        followerId: "user-a",
        followingId: "user-b",
      }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("unfollows an existing relationship and rejects missing pairs", async () => {
    const t = createConvexTest();
    const asFollower = t.withIdentity({ subject: "user-a" });

    await asFollower.mutation(api.followers.followUsers, {
      followerId: "user-a",
      followingId: "user-b",
    });
    await asFollower.mutation(api.followers.unfollowUsers, {
      followerId: "user-a",
      followingId: "user-b",
    });

    expect(
      await t.query(api.followers.isFollowing, {
        followerId: "user-a",
        followingId: "user-b",
      }),
    ).toBe(false);

    await expect(
      asFollower.mutation(api.followers.unfollowUsers, {
        followerId: "user-a",
        followingId: "user-b",
      }),
    ).rejects.toThrowError("Follow relationship does not exist");
  });
});
