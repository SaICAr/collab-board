"use client";

import { Plus } from "lucide-react";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const { mutate, pending } = useApiMutation(api.board.create);

  const onCreate = async () => {
    try {
      const id = await mutate({
        orgId,
        title: "未命名",
      });
      toast.success("创建成功");
    } catch (error) {
      toast.error(`创建失败，原因：${error}`);
    }
  };

  return (
    <button
      disabled={pending || disabled}
      onClick={onCreate}
      className={cn(
        `col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800
        flex flex-col items-center justify-center py-6`,
        (pending || disabled) && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
    >
      <div />
      <Plus className="text-white h-12 w-12 stroke-1" />
      <p className="text-sm text-white font-light mt-1">New board</p>
    </button>
  );
};
