"use client";

import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import { Layer } from "@/types/canvas";

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, selection: [], pencilDraft: null, penColor: null }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
        layerColors: new LiveList([
          "#FFF9B1",
          "#44CA63",
          "#278EEF",
          "#9B69F5",
          "#D11a85",
          "#FC8E2A",
          "#000",
          "#fff",
        ]),
      }}
    >
      <ClientSideSuspense fallback={fallback}>{() => children}</ClientSideSuspense>
    </RoomProvider>
  );
};
