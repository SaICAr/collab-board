import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react";

import { Camera, CanvasMode, CanvasState, LayerType } from "@/types/canvas";

import { ToolButton } from "./tool-button";
import { ImageUploadButton } from "./image-upload-button";
import { ToolBarSide } from "./tool-bar-side";

interface ToolbarProps {
  camera: Camera;
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({ camera, canvasState, setCanvasState, undo, redo, canUndo, canRedo }: ToolbarProps) => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 
      flex flex-col gap-y-4"
    >
      <div
        className="bg-white rounded-md p-1.5 flex gap-y-1 
        flex-col items-center shadow-md"
      >
        <ToolButton
          label="选择"
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          isActive={[
            CanvasMode.None,
            CanvasMode.Translating,
            CanvasMode.SelectionNet,
            CanvasMode.Pressing,
            CanvasMode.Resizing,
          ].includes(canvasState.mode)}
        />

        <ToolButton
          label="文本"
          icon={Type}
          onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Text })}
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
        />
        
        <ToolBarSide>
          <ToolButton
            label="便签"
            icon={StickyNote}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Note,
              })
            }
            isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
          />
        </ToolBarSide>

        <ToolBarSide>
          <ToolButton
            label="矩形"
            icon={Square}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Rectangle,
              })
            }
            isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle}
          />
        </ToolBarSide>

        <ToolBarSide>
          <ToolButton
            label="椭圆"
            icon={Circle}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Ellipse,
              })
            }
            isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
          />
        </ToolBarSide>

        <ToolButton
          label="画笔"
          icon={Pencil}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Pencil,
            })
          }
          isActive={canvasState.mode === CanvasMode.Pencil}
        />

        <ImageUploadButton camera={camera} setCanvasState={setCanvasState} />
      </div>

      <div
        className="bg-white rounded-md p-1.5 flex flex-col 
        items-center shadow-md"
      >
        <ToolButton label="撤销（Ctrl + Z）" icon={Undo2} onClick={undo} isDisabled={!canUndo} />
        <ToolButton label="恢复（Ctrl + Shift + Z）" icon={Redo2} onClick={redo} isDisabled={!canRedo} />
      </div>
    </div>
  );
};

Toolbar.Skeleton = function toolbarSkeleton() {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 rounded-md
      flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md"
    />
  );
};
