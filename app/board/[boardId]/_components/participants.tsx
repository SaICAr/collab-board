"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";

import { UserAvatar } from "./user-avatar";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_OTHER_USERS = 2;

export const Participants = () => {
  const otherUsers = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = otherUsers.length > MAX_SHOWN_OTHER_USERS;

  return (
    <div
      className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 
      flex items-center shadow-md"
    >
      <div className="flex gap-x-2">
        {currentUser && (
          <UserAvatar
            src={currentUser.info?.avatar}
            name={`${currentUser.info?.name} (你)`}
            fallback={currentUser.info?.name?.[0]}
            borderColor={connectionIdToColor(currentUser.connectionId)}
          />
        )}

        {otherUsers.slice(0, MAX_SHOWN_OTHER_USERS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              key={connectionId}
              src={info?.avatar}
              name={info?.name}
              fallback={info?.name?.[0] || "T"}
              borderColor={connectionIdToColor(connectionId)}
            />
          );
        })}

        {hasMoreUsers && <UserAvatar fallback={`+${otherUsers.length - MAX_SHOWN_OTHER_USERS}`} />}
      </div>
    </div>
  );
};

Participants.Skeleton = function participantsSkeleton() {
  return (
    <div
      className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 
      flex items-center shadow-md w-[100px]"
    />
  );
};
