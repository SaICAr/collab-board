import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const randomImage = args.images[Math.floor(Math.random() * args.images.length)];

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
