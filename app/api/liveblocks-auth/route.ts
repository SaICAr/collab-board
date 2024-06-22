import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { currentUser, auth } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: "sk_dev_xNxjpJxWodc3Zd0nAfaN04w9Tn7hH5ZfO8LKsjUy48QvgtqThVK33zFsrqkJ7i6X",
});

export async function POST(request: Request) {
  const authorization = auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("用户未授权", { status: 403 });
  }

  const { room } = await request.json();
  const board = await convex.query(api.board.get, { id: room });

  if (board?.orgId !== authorization.orgId) {
    return new Response("用户未授权", { status: 403 });
  }

  const userInfo = {
    name: user.firstName!,
    avatar: user.imageUrl!,
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo,
  });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
