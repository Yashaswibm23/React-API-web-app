import { createWMSTileLayer } from "./CreateTileLayer";
import LayerGroup from "ol/layer/Group";
import "ol/ol.css";

export function generateLayers() {
  const layer45 = createWMSTileLayer(
    process.env.REACT_APP_GEOSERVER_URL_LINUX,
    process.env.REACT_APP_LAYER_BANGALORE,
    "45 Map",
    true,
    5,
    20
  );

  const layer140 = createWMSTileLayer(
    process.env.REACT_APP_GEOSERVER_URL_LINUX_ONE,
    process.env.REACT_APP_LAYER_REST,
    "140 Map",
    true,
    5,
    20
  );

  const layer200_forest = createWMSTileLayer(
    process.env.REACT_APP_GEOSERVER_URL_NEW,
    process.env.REACT_APP_LAYER_FOREST,
    "200 Forest",
    true,
    5,
    20
  );
  const layer200_water = createWMSTileLayer(
    process.env.REACT_APP_GEOSERVER_URL_NEW,
    process.env.REACT_APP_LAYER_WATER,
    "200 Water",
    true,
    5,
    20
  );

  const layerGroup = new LayerGroup({
    layers: [layer200_forest, layer200_water, layer45, layer140],
    layers:[layer45]
  });

  return layerGroup;
}
