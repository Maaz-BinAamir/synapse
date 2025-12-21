import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { createAuth, authComponent } from "./auth";
import { components } from "./_generated/api";

export const getUserByName = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!profile) {
      return null;
    }

    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: profile.userId }],
    });

    const avatar = profile.avatar
      ? await ctx.storage.getUrl(profile.avatar)
      : null;

    return { user, profile: { ...profile, avatar } };
  },
});

export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: identity.subject }],
    });

    const profile = await ctx.db
      .query("profile")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    const avatar = profile?.avatar
      ? await ctx.storage.getUrl(profile.avatar)
      : null;

    return { user, profile: { ...profile, avatar } };
  },
});

export const getUsers = query({
  args: { userIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const users = await Promise.all(
      args.userIds.map(async (id) => {
        return await ctx.runQuery(components.betterAuth.adapter.findOne, {
          model: "user",
          where: [{ field: "_id", value: id }],
        });
      })
    );

    const userswithAvatars = await Promise.all(
      users.map(async (user) => {
        const profile = await ctx.db
          .query("profile")
          .withIndex("by_user", (q) => q.eq("userId", user?._id || ""))
          .first();
        const avatar = profile?.avatar
          ? await ctx.storage.getUrl(profile.avatar)
          : null;
        return { ...user, avatar };
      })
    );

    return userswithAvatars;
  },
});

export const updateUserPassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.changePassword({
      body: {
        currentPassword: args.currentPassword,
        newPassword: args.newPassword,
      },
      headers,
    });
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateProfile = mutation({
  args: {
    username: v.string(),
    bio: v.string(),
    interests: v.array(v.string()),
    avatar: v.optional(v.id("_storage")),
    hasRemovedAvatar: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("profile")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (existingProfile) {
      if (existingProfile.avatar && (args.avatar || args.hasRemovedAvatar)) {
        await ctx.storage.delete(existingProfile.avatar);
      }

      await ctx.db.patch(existingProfile._id, {
        username: args.username,
        bio: args.bio,
        interests: args.interests,
        avatar:
          args.avatar ||
          (existingProfile.avatar && args.hasRemovedAvatar
            ? undefined
            : existingProfile.avatar),
      });
    } else {
      await ctx.db.insert("profile", {
        userId: identity.subject,
        username: args.username,
        bio: args.bio,
        interests: args.interests,
        avatar: args.avatar,
      });
    }
  },
});

export const isOnboardingComplete = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();
    return !!profile;
  },
});
