import PageHead from "../components/PageHead";
import MapList from "../components/MapList";
import ListItemContent from "../components/pages/signal-monitor/ListItemContent";
import PopUpContent from "../components/pages/signal-monitor/PopUpContent";
import InfoContent from "../components/pages/signal-monitor/InfoContent";
import PopUpHoverContent from "../components/pages/cameras/PopUpHoverContent";
import Alert from "react-bootstrap/Alert";
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
      <PageHead
        title="Traffic signal monitor"
        description="Real-time traffic signal monitoring"
        pageRoute="/signal-monitor"
        imageRoute="/assets/signal-monitor.jpg"
      />
      <Alert variant={"info"}>
        Winter Storm Impacts: We're aware of power issues at the following
        intersections and are working to get power restored. The following
        intersections have a status of "dark" meaning they are not running and
        have supplementary stop signs or "Flashing under emergency battery power
      </Alert>
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
