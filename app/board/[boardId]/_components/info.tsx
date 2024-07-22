"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useRenameModal } from "@/store/use-rename-modal";
import { Actions } from "@/components/actions";
import { TabSeparator } from "@/components/tab-separator";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <Info.Skeleton />;

  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5
      h-12 flex items-center shadow-md"
    >
      <Button asChild variant="board" className="px-2">
        <Link href="/">
          {/* <Image src="/logo.svg" alt="Logo" height={60} width={60} /> */}
          <span className={cn("font-semibold text-xl text-black", font.className)}>CollabBoard</span>
        </Link>
      </Button>

      <TabSeparator />

      <Button variant="board" className="text-base font-normal px-2" onClick={() => onOpen(data._id, data.title)}>
        {data?.title}
      </Button>

      <TabSeparator />

      <Actions id={data._id} title={data.title} side="bottom" sideOffset={10}>
        <Button size="icon" variant="board">
          <Menu />
        </Button>
      </Actions>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5
      h-12 flex items-center shadow-md w-[300px]"
    />
  );
};
