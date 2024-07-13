"use client";

import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          邀请成员
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-[880px] bg-transparent border-none">
        <OrganizationProfile routing="hash" />
      </DialogContent>
    </Dialog>
  );
};
