"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { toJpeg, toPng, toSvg, toCanvas } from "html-to-image";
import { saveAs } from "file-saver";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type FileType = "PNG" | "JPG" | "WEBP" | "SVG";

export const DownloadButton = () => {
  const snapshotCreator = (fileType: FileType) => {
    return new Promise<Blob | string>((resolve, reject) => {
      const scale = 1;

      const element = typeof window !== undefined && document.getElementById("svg-canvas");

      if (!element) {
        toast.error("画布获取异常");
        throw new Error("画布获取异常");
      }

      if (fileType === "JPG") {
        toJpeg(element, {
          height: element.offsetHeight * scale,
          width: element.offsetWidth * scale,

          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: element.offsetWidth + "px",
            height: element.offsetHeight + "px",
            backgroundColor: "#f5f5f5",
          },
        })
          .then((dataUrl) => {
            const blob = dataUrl as unknown as Blob;
            resolve(blob);
          })
          .catch((err) => {
            toast.error(`保存失败，原因：${err}`);
            reject(err);
          });
      } else if (fileType === "PNG") {
        toPng(element, {
          height: element.offsetHeight * scale,
          width: element.offsetWidth * scale,

          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: element.offsetWidth + "px",
            height: element.offsetHeight + "px",
          },
        })
          .then((dataUrl) => {
            const blob = dataUrl as unknown as Blob;
            resolve(blob);
          })
          .catch((err) => {
            toast.error(`保存失败，原因：${err}`);
            reject(err);
          });
      } else if (fileType === "SVG") {
        toSvg(element, {
          height: element.offsetHeight * scale,
          width: element.offsetWidth * scale,

          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: element.offsetWidth + "px",
            height: element.offsetHeight + "px",
          },
        })
          .then((dataUrl) => {
            const blob = dataUrl as unknown as Blob;
            resolve(blob);
          })
          .catch((err) => {
            toast.error(`保存失败，原因：${err}`);
            reject(err);
          });
      } else if (fileType === "WEBP") {
        toCanvas(element, {
          height: element.offsetHeight * scale,
          width: element.offsetWidth * scale,

          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: element.offsetWidth + "px",
            height: element.offsetHeight + "px",
          },
        })
          .then((canvas) => {
            resolve(canvas.toDataURL("image/webp"));
          })
          .catch((err) => {
            toast.error(`保存失败，原因：${err}`);
            reject(err);
          });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="board" className="mr-4 h-12 bg-white rounded-md shadow-md">
          <Download className="h-4 w-4 mr-2" />
          保存
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10} className="grid grid-cols-2 gap-2.5 p-4 w-72">
        {(["PNG", "JPG", "WEBP", "SVG"] as FileType[]).map((file) => (
          <DropdownMenuItem key={file} className="outline-none p-0">
            <Button
              variant="outline"
              onClick={() =>
                snapshotCreator(file)
                  .then((blob) => saveAs(blob, `collab-board-${format(Date.now(), "yyyyMMddHHmmss")}`))
                  .catch((err) => {
                    toast.error(`保存失败，原因：${err}`);
                  })
              }
              className="w-full rounded-lg border border-border/80 text-[0.8rem] font-medium"
            >
              .{file}
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
