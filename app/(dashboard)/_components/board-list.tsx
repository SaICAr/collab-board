"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { EmptyBoards } from "./empty-boards";
import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-search";
import { BoardCard } from "./board-card";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, { orgId });

  // query有三种状态 1、有值 2、null（表示没查到） 3、undefined（表示查询中）
  if (data === undefined) {
    return <div>Loading...</div>;
  }

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  if (!data?.length) {
    return <EmptyBoards />;
  }

  return (
    <div>
      <h2 className="text-3xl">{query.favorites ? "Favorite boards" : "Team boards"}</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4
       lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10"
      >
        {data?.map(({ _id, _creationTime, ...rest }) => (
          <BoardCard key={_id} id={_id} createAt={_creationTime} isFavorite={false} {...rest} />
        ))}
      </div>
    </div>
  );
};
