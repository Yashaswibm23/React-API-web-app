import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

import { customTileLoadFunction } from "./CustomTileLoadFunction";

export function createWMSTileLayer(
  url,
  layerName,
  title,
  visible,
  minZoom,
  maxZoom
) {
  return new TileLayer({
    preload: Infinity,
    source: new TileWMS({
      url: url,
      params: {
        LAYERS: layerName,
        TILED: true,
        FORMAT: "image/png",
        TRANSPARENT: true,
        ANTIALIAS: true,
      },
      projection: process.env.REACT_APP_PROJECTION,
      crossOrigin: "anonymous",
      ratio: 1,
      serverType: "geoserver",
      tileLoadFunction: customTileLoadFunction,
    }),
    visible: visible,
    title: title,
    minZoom: minZoom,
    maxZoom: maxZoom,
  });
}
