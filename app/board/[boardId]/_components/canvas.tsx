"use client";

import { nanoid } from "nanoid";
import { Matrix } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LiveObject } from "@liveblocks/client";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf,
} from "@liveblocks/react/suspense";

import {
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  getInitTransform,
  getTransformedRectPoint,
  matrixToArray,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  recomputeTransformRect,
  resizeRect,
} from "@/lib/utils";
import {
  Camera,
  CanvasMode,
  CanvasState,
  InsertableLayerType,
  Layer,
  LayerType,
  Point,
  Side,
  TransformRect,
  XYWH,
} from "@/types/canvas";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { CursorsPresence } from "./cursors-presence";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { Path } from "./layers/path";
import { SelectionNet } from "./selection-net";
import { DownloadButton } from "./download-button";
import { useGraphStore } from "@/store/use-graph";
import { usePencilStore } from "@/store/use-pencil";
import { useTextStore } from "@/store/use-text";

export const MAX_LAYERS = 100;
export const SELECTION_NET_THRESHOLD = 5;
export const INSERT_LAYER_THRESHOLD = 5;
export const DEFAULT_COLOR = "#fff";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const prevLayers = useRef<ReadonlyMap<string, Layer> | null>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const { graphColor } = useGraphStore();
  const { pencilSize, pencilColor } = usePencilStore();
  const { textColor } = useTextStore();

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  useDisableScrollBounce();

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onResizeHandlePointerDown = useMutation(
    ({ storage }, corner: Side, initialBounds: XYWH) => {
      history.pause();

      const layers = storage.get("layers");
      prevLayers.current = layers.toImmutable();

      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > SELECTION_NET_THRESHOLD) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();

      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(layerIds, layers, current, origin);

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: pencilColor,
        penSize: pencilSize,
      });
    },
    [pencilColor, pencilSize]
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      // e.buttons 表示按下鼠标左键
      if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft == null) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  const insertPath = useMutation(({ storage, self, setMyPresence }) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft, penColor, penSize } = self.presence;
    if (
      pencilDraft == null ||
      penColor == null ||
      penSize == null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, penColor, penSize)));
    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);

    setMyPresence({ pencilDraft: null });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, []);

  const startInserting = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Inserting) return;

      setCanvasState({
        mode: CanvasMode.Inserting,
        layerType: canvasState.layerType,
        origin: point,
        current: point,
      });
    },
    [canvasState]
  );

  const drawingLayer = useCallback(
    (e: React.PointerEvent, current: Point, origin: Point) => {
      // e.buttons 表示按下鼠标左键
      if (canvasState.mode !== CanvasMode.Inserting || e.buttons !== 1) {
        return;
      }

      setCanvasState({
        mode: CanvasMode.Inserting,
        layerType: canvasState.layerType,
        origin,
        current,
      });
    },
    [canvasState]
  );

  const insertLayer = useMutation(
    ({ storage, setMyPresence }, layerType: InsertableLayerType, current: Point, origin: Point) => {
      const liveLayers = storage.get("layers");

      if (
        liveLayers.size >= MAX_LAYERS ||
        Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) < INSERT_LAYER_THRESHOLD
      ) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();

      const x = Math.min(current.x, origin.x);
      const y = Math.min(current.y, origin.y);
      const width = Math.abs(current.x - origin.x);
      const height = Math.abs(current.y - origin.y);
      const transform = getInitTransform({ x, y });

      const layer = new LiveObject({
        type: layerType,
        x,
        y,
        width,
        height,
        transform,
        fill: layerType === LayerType.Text ? textColor : graphColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [graphColor, textColor]
  );

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          const { width, height, transform: _transform } = layer.toImmutable();
          const transform = matrixToArray(new Matrix(..._transform).translate(offset.x, offset.y));
          const { x, y } = getTransformedRectPoint(width, height, transform);

          layer.update({
            x,
            y,
            transform,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const clearEmptyText = useMutation(({ self, storage }) => {
    const layers = storage.get("layers");
    const layerIds = storage.get("layerIds");

    for (let layerId of layerIds.toImmutable()) {
      const layer = layers.get(layerId);

      if (layer && layer.get("type") === LayerType.Text) {
        if (!layer.get("value")) {
          layers.delete(layerId);
          const layerIndex = layerIds.indexOf(layerId);
          if (layerIndex !== -1) {
            layerIds.delete(layerIndex);
          }
        }
      }
    }
  }, []);

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const { initialBounds, corner } = canvasState;

      const liveLayers = storage.get("layers");
      const selections = self.presence.selection;

      if (selections.length > 1) {
        const startMultiRect: TransformRect = {
          width: initialBounds.width,
          height: initialBounds.height,
          transform: getInitTransform({ x: initialBounds.x, y: initialBounds.y }),
        };

        const newMultiRect = resizeRect(corner, point, startMultiRect, {
          noChangeWidthAndHeight: true,
        });

        /**
         * 计算旧transform到新transform所需要应用的矩阵B
         *  B * A(旧) = C(新)
         *  B = C(新) * A'(旧的逆矩阵)
         */
        const prependedTransform = new Matrix(...newMultiRect.transform).append(
          new Matrix(...startMultiRect.transform).invert()
        );

        for (let layerId of selections) {
          const layer = liveLayers.get(layerId);
          const prevLayer = prevLayers.current?.get(layerId);

          if (layer && prevLayer) {
            const rect: TransformRect = {
              width: prevLayer.width,
              height: prevLayer.height,
              transform: matrixToArray(new Matrix(...prevLayer.transform).prepend(prependedTransform)),
            };

            const { width, height, transform } = recomputeTransformRect(rect);

            const { x, y } = getTransformedRectPoint(width, height, transform);

            layer.update({
              x,
              y,
              width,
              height,
              transform,
            });
          }
        }
      } else {
        const layer = liveLayers.get(selections[0]);
        const prevLayer = prevLayers.current?.get(selections[0]);

        if (layer && prevLayer) {
          const { width, height, transform } = resizeRect(corner, point, {
            width: prevLayer.width,
            height: prevLayer.height,
            transform: prevLayer.transform,
          });

          const { x, y } = getTransformedRectPoint(width, height, transform);

          layer.update({
            x,
            y,
            width,
            height,
            transform,
          });
        }
      }
    },
    [canvasState]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Inserting) {
        canvasState.origin && drawingLayer(e, current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [camera, canvasState, updateSelectionNet]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
        unselectLayers();
        clearEmptyText();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        canvasState.origin && insertLayer(canvasState.layerType, point, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [camera, canvasState, history, insertLayer]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        startInserting(point);
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, startDrawing, startInserting]
  );

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [camera, history, canvasState.mode]
  );

  const mySelections = useSelf((me) => me.presence.selection);
  const otherSelections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const [connectionId, selection] of otherSelections) {
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    if (mySelections.length) {
      for (const layerId of mySelections) {
        layerIdsToColorSelection[layerId] = "#3b82f6";
      }
    }

    return layerIdsToColorSelection;
  }, [otherSelections, mySelections]);

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Delete":
          // case "Backspace":
          deleteLayers();
          break;

        case "Z":
        case "z":
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [history, deleteLayers, canvasState.mode]);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />

      <div className="flex items-center absolute h-12 top-2 right-2">
        <DownloadButton />
        <Participants />
      </div>

      <Toolbar
        camera={camera}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
      {/* <ZoomTool /> */}
      {![CanvasMode.SelectionNet, CanvasMode.Translating, CanvasMode.Resizing].includes(canvasState.mode) && (
        <SelectionTools camera={camera} />
      )}
      <svg
        id="svg-canvas"
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          <SelectionNet canvasState={canvasState} />
          <CursorsPresence />
          {pencilDraft !== null && pencilDraft.length > 0 && (
            <Path points={pencilDraft} fill={pencilColor} x={0} y={0} size={pencilSize} />
          )}
        </g>
      </svg>
    </main>
  );
};
