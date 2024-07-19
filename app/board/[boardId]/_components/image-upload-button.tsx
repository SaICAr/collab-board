"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { ImageUp } from "lucide-react";
import { useMutation } from "@liveblocks/react/suspense";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MAX_LAYERS } from "./canvas";
import { LiveObject } from "@liveblocks/client";
import { Camera, CanvasMode, CanvasState, ImageLayer, LayerType } from "@/types/canvas";
import { getInitTransform } from "@/lib/utils";

interface ImageUploadButtonProps {
  camera: Camera;
  setCanvasState: (newState: CanvasState) => void;
}

const MAX_FILE_SIZE = 128 * 1024;

export const ImageUploadButton = ({ camera, setCanvasState }: ImageUploadButtonProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const fileAccept = useMemo(() => ["image/png", "image/jpeg", "image/svg+xml"], []);

  const handleUploadChange = useMutation(
    ({ storage, setMyPresence }, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";

      if (!file) {
        return;
      }

      if (!fileAccept.includes(file.type)) {
        toast.error(<div>上传图片格式有误，仅支持 .png、.jpeg、.jpg、.svg</div>, {
          position: "top-center",
        });

        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("上传失败，图片大小必须小于 128KB", {
          position: "top-center",
        });

        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const listener = () => {
        // 构建 img 获取图片大小
        const dataUrl = reader.result as string;
        const img = document.createElement("img");
        img.setAttribute("src", dataUrl);

        img.onload = () => {
          const liveLayers = storage.get("layers");
          if (liveLayers.size >= MAX_LAYERS) {
            return;
          }
          // TODO: 后续考虑缩放
          const width = img.width;
          const height = img.height;
          const x = window.innerWidth / 2 - width / 2 - camera.x;
          const y = window.innerHeight / 2 - height / 2 - camera.y;

          const liveLayerIds = storage.get("layerIds");
          const layerId = nanoid();
          const layer = new LiveObject<ImageLayer>({
            type: LayerType.Image,
            x,
            y,
            width,
            height,
            value: dataUrl,
            transform: getInitTransform({ x, y }),
          });

          liveLayerIds.push(layerId);
          liveLayers.set(layerId, layer);

          setMyPresence({ selection: [layerId] }, { addToHistory: true });
          setCanvasState({
            mode: CanvasMode.None,
          });

          reader.removeEventListener("load", listener);
        };
      };

      reader.addEventListener("load", listener);
    },
    [fileAccept, camera]
  );

  return (
    <Hint label="图片上传" side="right" sideOffset={14}>
      <>
        <Button size="icon" variant={"board"} asChild>
          <Label htmlFor="image-upload" className="cursor-pointer">
            <ImageUp />
          </Label>
        </Button>

        <Input
          ref={fileRef}
          id="image-upload"
          type="file"
          className="w-0 h-0 opacity-0 p-0"
          accept={fileAccept.join(",")}
          onChange={handleUploadChange}
        />
      </>
    </Hint>
  );
};
