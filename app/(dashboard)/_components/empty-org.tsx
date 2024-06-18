"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";

export const EmptyOrg = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-org.svg" alt="Empty organization" width={250} height={250} />

      <h2 className="text-2xl font-semibold mt-6">欢迎使用白板</h2>
      <p className="text-muted-foreground text-sm mt-2">创建新的组织，开始你的表演~</p>
      <div className="mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">创建组织</Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-[480px] bg-transparent border-none">
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
