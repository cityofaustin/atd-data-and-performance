import Head from "next/head";
import MapList from "../components/MapList";
import ListItemContent from "../components/pages/signal-monitor/ListItemContent";
import PopUpContent from "../components/pages/signal-monitor/PopUpContent";
import InfoContent from "../components/pages/signal-monitor/InfoContent";
import PopUpHoverContent from "../components/pages/cameras/PopUpHoverContent";
import { useSocrata } from "../utils/socrata";
import { SIGNAL_STATUS_QUERY } from "../utils/queries";
import {
  FILTER_SETTINGS,
  SEARCH_SETTINGS,
  LAYER_STYLES,
  getMapIcon,
} from "../page-settings/signal-monitor";

export default function SignalMonitor() {
  const {
    data: geojson,
    loading,
    error,
  } = useSocrata({ ...SIGNAL_STATUS_QUERY });

  return (
    <>
      <Head>
        <title>Traffic signal monitor</title>
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
        title="Signal monitor"
        getMapIcon={getMapIcon}
        featurePk="signal_id"
      />
    </>
  );
}
