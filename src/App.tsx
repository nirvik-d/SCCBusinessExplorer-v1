import "@esri/calcite-components/components/calcite-shell";

import esriConfig from "@arcgis/core/config";
import { RenderMap } from "../components/RenderMap";
import { FetchFeatureLayers } from "../components/FetchFeatureLayers";
import "./App.css";
import { useRef, useState } from "react";
import { RenderCalciteUI } from "../components/RenderCalciteUI";
import { DisplayCoastalPlaces } from "../components/DisplayCoastalPlaces";
import { DisplayBusinesses } from "../components/DisplayBusinesses";

function App() {
  esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;

  const mapRef = useRef<any>(null),
    mapViewRef = useRef<any>(null),
    layerRef = useRef<any>(null);
  const [isDrawingComplete, setDrawingComplete] = useState<any>(null);
  const [isLoadingComplete, setLoadingComplete] = useState<any>(null);

  function handleDrawingComplete(complete: boolean) {
    setDrawingComplete(complete);
  }

  function handleLoadingComplete(complete: boolean) {
    setLoadingComplete(complete);
  }

  return (
    <>
      <FetchFeatureLayers
        mapRef={mapRef}
        layerRef={layerRef}
        isLoadingComplete={handleLoadingComplete}
      />
      <calcite-shell>
        <RenderMap
          mapType="arcgis/topographic"
          mapCenter={[-117.9988, 33.6595]}
          mapZoom={8}
          mapRef={mapRef}
          mapViewRef={mapViewRef}
          isDrawingComplete={handleDrawingComplete}
        />
        {isDrawingComplete && isLoadingComplete && (
          <>
            <DisplayCoastalPlaces mapRef={mapRef} layerRef={layerRef} />
            <RenderCalciteUI mapViewRef={mapViewRef} layerRef={layerRef} />
            <DisplayBusinesses mapRef={mapRef} mapViewRef={mapViewRef} />
          </>
        )}
      </calcite-shell>
    </>
  );
}

export default App;
