"use client";

import { BoardCard } from "../board-card";
import { NewBoardButton } from "../new-board-button";

interface BoardListSkeletonProps {
  orgId: string;
  favorites?: string;
}

export const BoardListSkeleton = ({ orgId, favorites }: BoardListSkeletonProps) => {
  return (
    <div>
      <h2 className="text-3xl">{favorites ? "Favorite boards" : "Team boards"}</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4
        lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10"
      >
        <NewBoardButton orgId={orgId} disabled />
        <BoardCard.Skeleton />
        <BoardCard.Skeleton />
        <BoardCard.Skeleton />
        <BoardCard.Skeleton />
      </div>
    </div>
  );
};
