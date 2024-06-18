"use client";

import Image from "next/image";
import { useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export const EmptyBoards = () => {
  const { organization } = useOrganization();
  const create = useMutation(api.board.create);

  const onClick = () => {
    if (!organization) return;

    create({
      orgId: organization.id,
      title: "Untitled",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-boards.svg" alt="Empty Boards" width={225} height={225} />

      <h2 className="text-2xl font-semibold mt-6">创建第一个白板！</h2>
      <p className="text-muted-foreground text-sm mt-2">开始给你的组织创建第一个白板吧~</p>
      <div className="mt-4">
        <Button size="lg" onClick={onClick}>
          创建白板
        </Button>
      </div>
    </div>
  );
};
