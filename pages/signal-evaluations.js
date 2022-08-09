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

const useSimpleStatuses = (locations) =>
  useMemo(() => {
    if (!locations) return;

    locations.features.forEach((feature) => {
      // we're updating locations in-place, but we want to return a new reference
      // to control loading / render state

      const status = feature.properties.location_status.toLowerCase();
      // should never happen because the socrata dataset's source knack container excludes records with null statuses
      if (!status) return;

      const statusDefMatch = STATUS_DEFS.find((statusDef) =>
        statusDef.location_statuses.includes(status.toLowerCase())
      );

      // should never happen - indicates a status value was modified in source Knack records
      if (!statusDefMatch) return;
      feature.properties.status_simple = statusDefMatch.status_simple;
    });

    return locations;
  }, [locations]);

export default function SignalEvaluations() {
  const {
    data: locations,
    loading,
    error,
  } = useSocrata({ ...SIGNAL_EVALUATIONS_QUERY });

  const geojson = useSimpleStatuses(locations);

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
