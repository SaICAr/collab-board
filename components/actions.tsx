"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { ConfirmModal } from "./modal/confirm-modal";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
  children: React.ReactNode;
  id: string;
  title: string;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
}

export const Actions = ({ children, id, title, side, sideOffset }: ActionsProps) => {
  const router = useRouter();
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onDelete = async () => {
    try {
      await mutate({
        id,
      });

      toast.success("删除成功");
      router.push("/");
    } catch (error) {
      toast.success("删除失败");
    }
  };

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/board/${id}`);

      toast.success("链接复制成功");
    } catch (error) {
      toast.error("链接复制失败");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        className="w-[150px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          复制链接
        </DropdownMenuItem>

        <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => onOpen(id, title)}>
          <Pencil className="h-4 w-4 mr-2" />
          编辑标题
        </DropdownMenuItem>

        <ConfirmModal header="确定删除？" disabled={pending} onConfirm={onDelete}>
          <Button variant="ghost" className="p-3 cursor-pointer text-sm w-full justify-start font-normal">
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
