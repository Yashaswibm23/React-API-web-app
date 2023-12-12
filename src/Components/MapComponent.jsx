import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat, toLonLat } from "ol/proj";
import "./MapComponent.css";
import { generateLayers } from "./GenerateLayers";
import ScaleLine from "ol/control/ScaleLine";
import Zoom from "ol/control/Zoom";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import { debounce, throttle } from "lodash";
import { Feature, Overlay } from "ol";
import { Polygon } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

const CACHE_EXPIRATION_TIME = 3600000;

const MapComponent = ({
  coords,
  setCoords,
  setCardBodyDisp,
  dispMarker,
  setDispMarker,
  zoom,
  setZoom,
  polyData,
  polyCoord,
  setClicked,
  setQuery,
  updatePolyData,
}) => {
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const [layers, setLayers] = useState(null);
  const [cache, setCache] = useState(null);
  const viewRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      view: new View({
        center: fromLonLat([77.5854568196905, 12.955444039398824]),
        zoom: zoom,
        maxZoom: 20,
      }),
      controls: [
        new Zoom(),
        new ScaleLine({
          bar: true,
          text: true,
        }),
      ],
    });
    const view = map.getView();
    viewRef.current = view;

    if (coords.length) {
      view.setCenter(fromLonLat(coords));
    } else if (polyCoord.length) {
      view.setCenter(fromLonLat(polyCoord));
    } else {
      view.setCenter(fromLonLat([77.5854568196905, 12.955444039398824]));
    }

    if (layers) {
      layers.getLayers().forEach((layer) => {
        map.addLayer(layer);
      });
    }
    // console.log("coords", coords);
    // console.log(
    //   `polyData:${polyData.length}--------${polyData}--------------- polyCoord:${polyCoord}`
    // );

    const handlePolyDataUpdate = (polyData) => {
      // console.log(polyData, "polyData in MapComponent");
      return polyData;
    };

    handlePolyDataUpdate(polyData);

    // console.log(polyData, "polydataaaaaaaaa");
    if (polyData && polyData.length) {
      const coordinates = polyData.map(([lon, lat]) => fromLonLat([lon, lat]));
      const polygon = new Polygon([coordinates]);

      const vectorSource = new VectorSource({
        features: [
          new Feature({
            geometry: polygon,
          }),
        ],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: "red",
            width: 2,
            lineDash: [5, 5],
          }),
          fill: new Fill({
            color: "rgba(255, 0, 0, 0.1)",
          }),
        }),
      });

      map.addLayer(vectorLayer);
      view.setCenter(fromLonLat(polyCoord));
      const extent = polygon.getExtent();
      view.fit(extent);
    }

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(7),
      projection: process.env.REACT_APP_PROJECTION,
      undefinedHTML: "&nbsp;",
    });

    const throttledMousePosition = throttle(() => {
      map.render();
    }, 300);

    map.addControl(mousePositionControl);

    const handleClick = (event) => {
      // view.setCenter(fromLonLat(coords));

      const coordinate = map.getCoordinateFromPixel(event.pixel);
      const lonLat = toLonLat(coordinate);
      setCardBodyDisp(true);
      setClicked(true);
      setDispMarker(true);
      //  setHandleClickTriggered(true);
      setQuery("");
      setCoords([lonLat[0], lonLat[1]]);
      updatePolyData([]);

      const currentZoom = viewRef.current.getZoom(); // Get the current zoom level

      if (currentZoom < 12) {
        setZoom(16);
      } else {
        setZoom(currentZoom);
      }
      if (overlayRef.current !== null) {
        overlayRef.current.setPosition(coordinate);
      }

      event.preventDefault();
    };

    map.on("moveend", throttledMousePosition);
    map.on("click", handleClick);
    // map.on("loadstart", function () {
    //   map.getTargetElement().classList.add("spinner");
    // });
    // map.on("loadend", function () {
    //   map.getTargetElement().classList.remove("spinner");
    // });
    mapRef.current = map.getTarget();

    if (dispMarker) {
      const markerElement = document.createElement("div");
      markerElement.className = "marker";
      overlayRef.current = new Overlay({
        position: fromLonLat(coords),
        element: markerElement,
      });
      map.addOverlay(overlayRef.current);
      view.setCenter(fromLonLat(coords));
    }

    const handleKeyDown = (event) => {
      if (event.key === "+" || event.key === "=") {
        // Zoom in
        const currentResolution = viewRef.current.getResolution();
        const newResolution = currentResolution / 2;
        viewRef.current.setResolution(newResolution);
      } else if (event.key === "-") {
        // Zoom out
        const currentResolution = viewRef.current.getResolution();
        const newResolution = currentResolution * 2;
        viewRef.current.setResolution(newResolution);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      map.setTarget(null);
      map.un("moveend", throttledMousePosition);
    };
  }, [
    layers,
    coords,
    setCoords,
    setCardBodyDisp,
    dispMarker,
    setDispMarker,
    zoom,
    setZoom,
    polyData,
    polyCoord,
    setClicked,
    setQuery,
    updatePolyData,
  ]);

  useEffect(() => {
    const debouncedGenerateLayers = debounce(() => {
      if (cache) {
        // console.log("Cache found. Using cached layers.");
        setLayers(cache);
        return;
      }

      const generatedLayers = generateLayers();
      setCache(generatedLayers);
      setLayers(generatedLayers);
    }, 300);

    debouncedGenerateLayers();

    if (cache) {
      // console.log("Cache found. Using cached layers.");
      const cacheExpiration = setTimeout(() => {
        setCache(null);
      }, CACHE_EXPIRATION_TIME);
      // console.log("No cache found. Generating new layers...");
      return () => clearTimeout(cacheExpiration);
    }
  }, [cache]);

  // Function to set secure cookie
  const setSecureCookie = (name, value, days) => {
    const secureFlag = window.location.protocol === "https:" ? "; secure" : "";
    const sameSite =
      window.location.protocol === "https:" ? "; SameSite=None" : "";
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/${secureFlag}${sameSite}`;
  };

  useEffect(() => {
    const cookieName = "mySecureMapCookie";
    const secureCookie = getCookie(cookieName);
    if (!secureCookie) {
      setSecureCookie(cookieName, "CookieValue", 7);
    }
  }, []);

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      const cookieName = cookie[0];
      const cookieValue = cookie[1];
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return "";
  };

  return (
    <div className="map-container">
      <div style={{ width: "100vw", height: "100vh" }} ref={mapRef} />
    </div>
  );
};

export default MapComponent;
