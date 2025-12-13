import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { createAuth, authComponent } from "./auth";
import { components } from "./_generated/api";

export const getUserByName = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "name", value: args.username }],
    });
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
    return users;
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
