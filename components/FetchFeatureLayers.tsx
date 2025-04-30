import { useEffect } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";

interface DisplayFeatureLayersProps {
  mapRef?: any;
  layerRef?: any;
  isLoadingComplete: (complete: boolean) => void;
}

export function FetchFeatureLayers({
  mapRef,
  layerRef,
  isLoadingComplete,
}: DisplayFeatureLayersProps) {
  useEffect(() => {
    async function loadFeatures() {
      const coastalCitiesGraphicsLayer = new GraphicsLayer();

      const coastalBufferLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/uknczv4rpevve42E/arcgis/rest/services/California_Cartographic_Coastal_Polygons/FeatureServer/31",
        definitionExpression: "OFFSHORE IS NOT NULL",
        outFields: ["*"],
      });

      const coastalCitiesLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/uknczv4rpevve42E/arcgis/rest/services/California_Cities_and_Identifiers_Blue_Version_view/FeatureServer/2/",
        outFields: ["*"],
      });

      await coastalBufferLayer.load();
      await coastalCitiesLayer.load();

      const coastalBufferResult = await coastalBufferLayer.queryFeatures();
      if (!coastalBufferResult.features.length) {
        console.error("No coastal buffer found!");
        return;
      }

      for (const coastalBufferFeature of coastalBufferResult.features) {
        const coastalCitiesResult = await coastalCitiesLayer.queryFeatures({
          where:
            "CDTFA_COUNTY in ('Santa Barbara County', 'Ventura County', 'Los Angeles County', 'Orange County', 'San Diego County', 'San Luis Obispo County', 'Imperial County')",
          geometry: coastalBufferFeature.geometry,
          spatialRelationship: "intersects",
          returnGeometry: true,
          outFields: ["*"],
        });

        const coastalCitiesGraphics = createPlaceGraphics(
          coastalCitiesResult.features
        );
        coastalCitiesGraphicsLayer.addMany(coastalCitiesGraphics);
      }

      layerRef.current = coastalCitiesGraphicsLayer;
      isLoadingComplete(true);
    }

    loadFeatures();
  }, [mapRef]);

  return null;
}

function createPlaceGraphics(placeFeatures: any) {
  return placeFeatures.map((placeFeature: any) => {
    return new Graphic({
      geometry: placeFeature.geometry,
      attributes: placeFeature.attributes,
      symbol: {
        type: "simple-fill",
        color: [0, 120, 255, 0.5],
        outline: {
          color: [0, 0, 0, 0.6],
          width: 1,
        },
      },
      // popupTemplate: {
      //   title: "{CDTFA_CITY}",
      //   content: `
      //     <b>Census Place Type:</b> {CENSUS_PLACE_TYPE}<br/>
      //     <b>County:</b> {CDTFA_COUNTY}
      //   `,
      // },
    });
  });
}
