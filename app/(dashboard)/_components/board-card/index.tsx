"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Actions } from "@/components/actions";
import { Skeleton } from "@/components/ui/skeleton";

import { Overlay } from "./overlay";
import { Footer } from "./footer";

interface BoardCardProps {
  id: string;
  title: string;
  orgId: string;
  authorId: string;
  authorName: string;
  imageUrl: string;
  createAt: number;
  isFavorite: boolean;
}

export const BoardCard = ({
  id,
  orgId,
  title,
  imageUrl,
  authorId,
  authorName,
  createAt,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorName;
  const createAtLabel = formatDistanceToNow(createAt, {
    addSuffix: true,
  });

  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.board.favorite);
  const { mutate: onUnFavorite, pending: pendingUnFavorite } = useApiMutation(api.board.unFavorite);

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnFavorite({ id }).catch((err) => {
        toast.error("取消收藏失败", err);
      });
    } else {
      onFavorite({ id, orgId }).catch((err) => {
        toast.error("收藏失败", err);
      });
    }
  };

  return (
    <Link href={`/board/${id}`}>
      <div
        className="group aspect-[100/127] border rounded-lg 
        flex flex-col justify-between overflow-hidden"
      >
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt="Doodle" fill className="object-fill" />
          <Overlay />
          <Actions id={id} title={title} side="right">
            <button
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100
              transition-opacity px-3 py-2 outline-none"
            >
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>

        <Footer
          title={title}
          authorLabel={authorLabel}
          createAtLabel={createAtLabel}
          isFavorite={isFavorite}
          disabled={pendingFavorite || pendingUnFavorite}
          onStar={toggleFavorite}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
