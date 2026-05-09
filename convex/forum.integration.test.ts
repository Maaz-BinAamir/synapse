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

async function seedPost(
  t: ReturnType<typeof createConvexTest>,
  subject = "author-1",
  title = "Integrated post",
) {
  return t.withIdentity({ subject }).mutation(api.posts.create, {
    title,
    body: `${title} body`,
  });
}

describe("forum integration", () => {
  it("creates a post and retrieves the enriched post details", async () => {
    const t = createConvexTest();
    await seedProfile(t, "author-1", "alice");

    const postId = await seedPost(t);
    const post = await t.query(api.posts.getPostById, { postId });

    expect(post).toMatchObject({
      title: "Integrated post",
      author: {
        username: "alice",
      },
    });
  });

  it("propagates likes into hasLiked and trending results", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);
    const asReader = t.withIdentity({ subject: "reader-1" });

    await asReader.mutation(api.likes.toggleLike, { postId });

    expect(await asReader.query(api.likes.hasLiked, { postId })).toBe(true);
    const trending = await t.query(api.posts.getTrending, {});
    expect(trending[0]?._id).toBe(postId);
    expect(trending[0]?.likeCount).toBe(1);
  });

  it("propagates an unlike back into the post aggregate", async () => {
    const t = createConvexTest();
    const postId = await seedPost(t);
    const asReader = t.withIdentity({ subject: "reader-1" });

    await asReader.mutation(api.likes.toggleLike, { postId });
    await asReader.mutation(api.likes.toggleLike, { postId });

    expect(await asReader.query(api.likes.hasLiked, { postId })).toBe(false);
    const post = await t.query(api.posts.getPostById, { postId });
    expect(post.likeCount).toBe(0);
  });

  it("propagates a comment into both the post aggregate and comment listing", async () => {
    const t = createConvexTest();
    await seedProfile(t, "commenter-1", "mentor");
    const postId = await seedPost(t);

    await t.withIdentity({ subject: "commenter-1" }).mutation(api.comments.createComment, {
      postId,
      content: "Integrated comment",
    });

    const post = await t.query(api.posts.getPostById, { postId });
    const comments = await t.query(api.comments.getComments, { postId });
    expect(post.commentCount).toBe(1);
    expect(comments[0]).toMatchObject({
      content: "Integrated comment",
      author: { username: "mentor" },
    });
  });

  it("creates follower relationships visible from both follower and following queries", async () => {
    const t = createConvexTest();
    const asFollower = t.withIdentity({ subject: "user-a" });

    await asFollower.mutation(api.followers.followUsers, {
      followerId: "user-a",
      followingId: "user-b",
    });

    const followers = await t.query(api.followers.getFollowers, { userId: "user-b" });
    const following = await t.query(api.followers.getFollowing, { userId: "user-a" });

    expect(followers).toHaveLength(1);
    expect(following).toHaveLength(1);
  });

  it("removes follower relationships through the unfollow mutation", async () => {
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
  });

  it("records views that surface in the dashboard recent posts feed", async () => {
    const t = createConvexTest();
    await seedProfile(t, "author-1", "alice");
    const postId = await seedPost(t);

    await t.withIdentity({ subject: "viewer-1" }).mutation(api.views.recordView, { postId });

    const recentPosts = await t
      .withIdentity({ subject: "viewer-1" })
      .query(api.dashboard.getRecentViewedPosts, {});

    expect(recentPosts).toHaveLength(1);
    expect(recentPosts[0]).toMatchObject({
      _id: postId,
      authorName: "alice",
    });
  });

  it("surfaces authored posts through latest and search queries", async () => {
    const t = createConvexTest();
    await seedProfile(t, "author-1", "alice");
    await seedPost(t, "author-1", "Cardiology crash course");
    await seedPost(t, "author-1", "Neurology review");

    const latest = await t.query(api.posts.getLatest, {});
    const searchResults = await t.query(api.posts.search, { query: "Cardiology" });

    expect(latest).toHaveLength(2);
    expect(searchResults[0]).toMatchObject({
      title: "Cardiology crash course",
      user: "alice",
    });
  });
});
