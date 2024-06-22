import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const images = [
  "/placeholders/0.svg",
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
  "/placeholders/11.svg",
  "/placeholders/12.svg",
  "/placeholders/13.svg",
  "/placeholders/14.svg",
  "/placeholders/15.svg",
  "/placeholders/16.svg",
  "/placeholders/17.svg",
  "/placeholders/18.svg",
  "/placeholders/19.svg",
  "/placeholders/20.svg",
  "/placeholders/21.svg",
];

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("操作未授权");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("boards", {
      orgId: args.orgId,
      title: args.title,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

export const remove = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("操作未授权");
    }

    // 删除收藏关系
    const userId = identity.subject;
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) => q.eq("userId", userId).eq("boardId", args.id))
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("操作未授权");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("标题不能为空");
    }

    if (title.length > 60) {
      throw new Error("标题长度不能超过60个字");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const favorite = mutation({
  args: {
    id: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("操作未授权");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("board 不存在");
    }

    const userId = identity.subject;

    // 判断收藏列表是否已经存在该 board
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board_org", (q) => q.eq("userId", userId).eq("boardId", args.id).eq("orgId", args.orgId))
      .unique();

    if (existingFavorite) {
      throw new Error("board 已经被收藏了");
    }

    const result = await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return result;
  },
});

export const unFavorite = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("操作未授权");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("board 不存在");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) => q.eq("userId", userId).eq("boardId", args.id))
      .unique();

    if (!existingFavorite) {
      throw new Error("收藏夹中不存在该board");
    }

    await ctx.db.delete(existingFavorite._id);
  },
});

export const get = query({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id);

    return board;
  },
});
