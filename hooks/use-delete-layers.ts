import { useSelf, useMutation } from "@liveblocks/react/suspense";

export const useDeleteLayers = () => {
  const selection = useSelf((me) => me.presence.selection);

  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");

      for (let id of selection) {
        liveLayers.delete(id);

        const layerIndex = liveLayerIds.indexOf(id);
        if (layerIndex !== -1) {
          liveLayerIds.delete(layerIndex);
        }
      }

      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selection]
  );
};
