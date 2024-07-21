"use client";

import { memo } from "react";
import { shallow, useOthersConnectionIds, useOthersMapped } from "@liveblocks/react/suspense";

import { Cursor } from "./cursor";
import { Path } from "./layers/path";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      pencilColor: other.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              points={other.pencilDraft}
              fill={other.pencilColor ? other.pencilColor : "#000"}
              x={0}
              y={0}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export const CursorsPresence = memo(() => {
  return (
    <>
      <Cursors />
      <Drafts />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";
