import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { createConvexTest } from "./test.setup";

async function seedPost(
  t: ReturnType<typeof createConvexTest>,
  authorId = "author-1",
) {
  return t.withIdentity({ subject: authorId }).mutation(api.posts.create, {
    title: "Case discussion",
    body: "Case body",
  });
}

describe("social unit", () => {
  it("rejects unauthenticated comment creation", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    await expect(
      t.mutation(api.comments.createComment, { postId, content: "Blocked" }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("rejects unauthenticated likes", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    await expect(
      t.mutation(api.likes.toggleLike, { postId }),
    ).rejects.toThrowError("Not authenticated");
  });

  it("falls back to Unknown when a comment author profile is missing", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);
    await t
      .withIdentity({ subject: "ghost-user" })
      .mutation(api.comments.createComment, {
        postId,
        content: "Anonymous note",
      });

    const comments = await t.query(api.comments.getComments, { postId });

    expect(comments[0]?.author.username).toBe("Unknown");
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

  it("ignores unauthenticated views", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);

    await t.mutation(api.views.recordView, { postId });

    const post = await t.query(async (ctx) => ctx.db.get(postId));
    expect(post?.viewCount).toBe(0);
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
