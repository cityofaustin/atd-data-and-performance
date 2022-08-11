import { useMemo } from "react";
import Head from "next/head";
import MapList from "../components/MapList";
import ListItemContent from "../components/pages/signal-evaluations/ListItemContent";
import PopUpContent from "../components/pages/signal-evaluations/PopUpContent";
import InfoContent from "../components/pages/signal-evaluations/InfoContent";
import PopUpHoverContent from "../components/pages/cameras/PopUpHoverContent";
import { useSocrata } from "../utils/socrata";
import { SIGNAL_EVALUATIONS_QUERY } from "../utils/queries";
import {
  FILTER_SETTINGS,
  SEARCH_SETTINGS,
  LAYER_STYLES,
  STATUS_DEFS,
} from "../page-settings/signal-evaluations";

const locationProps = [
  "atd_location_id",
  "council_district",
  "location_name",
  "location_status_simple",
];

const useGroupByLocation = (studies) =>
  useMemo(() => {
    if (!studies) return;

    const locationIndex = studies.features.reduce((locationIndex, feature) => {
      const { atd_location_id } = feature.properties;
      if (atd_location_id && !locationIndex[atd_location_id]) {
        const location = {
          type: "Feature",
          geometry: feature.geometry,
          properties: { atd_location_id },
        };
        location.properties.location_name = feature.properties.location_name;
        location.properties.location_status_simple =
          feature.properties.location_status_simple;
        location.properties.council_district =
          feature.properties.council_district;
        location.properties.location_name = feature.properties.location_name;
        location.properties.studies = [{ ...feature.properties }];
        locationIndex[atd_location_id] = location;
      } else {
        locationIndex[atd_location_id].properties.studies.push({
          ...feature.properties,
        });
      }
      return locationIndex;
    }, {});
    
    const features = Object.values(locationIndex);

    // set location modified date from most-recent study modified date
    features.forEach((feature) => {
      const studyDates = feature.properties.studies.map(
        (study) => study.modified_date
      );
      studyDates.reverse();
      feature.properties.modified_date = studyDates?.[0];
    });
    return {
      type: "FeatureCollection",
      features: [...features],
    };
  }, [studies]);

const dostuff = (geojson) => {
  if (!geojson) return;
  const counts = geojson.features.reduce((prev, feature) => {
    const key = feature.properties.location_status_simple;
    prev[key] = prev[key] ? prev[key] + 1 : 1;
    return prev;
  }, {});
  console.log("counts", counts);
};

export default function SignalEvaluations() {
  const {
    data: studies,
    loading,
    error,
  } = useSocrata({ ...SIGNAL_EVALUATIONS_QUERY });
  const geojson = useGroupByLocation(studies);

  return (
    <>
      <Head>
        <title>Traffic signal evaluations</title>
        <meta
          property="og:title"
          content="Austin Transportation Data and Performance Hub"
        />
      </Head>
      <MapList
        filterSettings={FILTER_SETTINGS}
        searchSettings={SEARCH_SETTINGS}
        geojson={geojson}
        loading={loading}
        error={error}
        PopUpContent={PopUpContent}
        PopUpHoverContent={PopUpHoverContent}
        ListItemContent={ListItemContent}
        InfoContent={InfoContent}
        layerStyles={LAYER_STYLES}
        title="Signal evaluations"
      />
    </>
  );
}
