"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";

export const EmptyBoards = () => {
  const { organization } = useOrganization();
  const [images, setImages] = useState([]);
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = async () => {
    if (!organization || !images.length) return;

    try {
      const id = await mutate({
        orgId: organization.id,
        title: "Untitled",
        images,
      });

      toast.success("创建成功");
    } catch (error) {
      toast.error(`创建失败，原因：${error}`);
    }
  };

  const getPlaceholders = async () => {
    const res = await fetch("/api/getPlaceholders");
    const { data } = await res.json();
    if (data && data.length) {
      setImages(data);
    }
  };

  useEffect(() => {
    getPlaceholders();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-boards.svg" alt="Empty Boards" width={225} height={225} />

      <h2 className="text-2xl font-semibold mt-6">创建第一个白板！</h2>
      <p className="text-muted-foreground text-sm mt-2">开始给你的组织创建第一个白板吧~</p>
      <div className="mt-4">
        <Button disabled={pending} size="lg" onClick={onClick}>
          {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          创建白板
        </Button>
      </div>
    </div>
  );
};
