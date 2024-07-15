import { shallow } from "@liveblocks/client";
import { useStorage, useSelf } from "@liveblocks/react/suspense";

import { boundingBox } from "@/lib/utils";

export const useSelectionBounds = () => {
  const selection = useSelf((me) => me.presence.selection);

  return useStorage((root) => {
    const selectedLayers = selection.map((layerId) => root.layers.get(layerId)!).filter(Boolean);

    return boundingBox(selectedLayers);
  }, shallow);
};
