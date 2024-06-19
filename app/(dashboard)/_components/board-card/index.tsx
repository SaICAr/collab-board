"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

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

export const BoardCard = ({ id, title, imageUrl, authorId, authorName, createAt, isFavorite }: BoardCardProps) => {
  const { userId } = useAuth();
  const authorLabel = userId === authorId ? "You" : authorName;
  const createAtLabel = formatDistanceToNow(createAt, {
    addSuffix: true,
  });

  return (
    <Link href={`/board/${id}`}>
      <div
        className="group aspect-[100/127] border rounded-lg 
        flex flex-col justify-between overflow-hidden"
      >
        <div className="relative flex-1">
          <Image src={imageUrl} alt="Doodle" fill className="object-fill" />
          <Overlay />
        </div>

        <Footer
          title={title}
          authorLabel={authorLabel}
          createAtLabel={createAtLabel}
          isFavorite={isFavorite}
          disabled={false}
          onClick={() => {}}
        />
      </div>
    </Link>
  );
};
