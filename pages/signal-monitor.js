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
} from "../page-settings/signal-monitor";

export default function SignalMonitor() {
  const {
    data: geojson,
    loading,
    error,
  } = useSocrata({ ...SIGNAL_STATUS_QUERY });

  if (loading || error) {
    return <p>Loading or error....</p>;
  }

  return (
    <MapList
      filterSettings={FILTER_SETTINGS}
      searchSettings={SEARCH_SETTINGS}
      geojson={geojson}
      loading={!geojson}
      error={error}
      PopUpContent={PopUpContent}
      PopUpHoverContent={PopUpHoverContent}
      ListItemContent={ListItemContent}
      InfoContent={InfoContent}
      layerStyles={LAYER_STYLES}
      title="Signal monitor"
    />
  );
}
