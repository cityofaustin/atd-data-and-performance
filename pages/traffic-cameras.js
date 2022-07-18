import { useMemo } from "react";
import MapList from "../components/MapList";
import PopUpHoverContent from "../components/pages/cameras/PopUpHoverContent";
import PopUpContent from "../components/pages/cameras/PopUpContent";
import ListItemContent from "../components/pages/cameras/ListItemContent.js";
import InfoContent from "../components/pages/cameras/InfoContent";
import { useSocrata } from "../utils/socrata";
import { CAMERAS_QUERY, CAMERA_COMM_STATUS_QUERY } from "../utils/queries";
import {
  FILTER_SETTINGS,
  SEARCH_SETTINGS,
  LAYER_STYLES,
} from "../page-settings/traffic-cameras";

const simplifyStatus = (status) => {
  switch (status) {
    case "online":
      return status;
    default:
      return "offline";
  }
};

const updateFeaturesWithCommStatus = ({ geojson, statuses }) => {
  geojson.features.forEach((feature) => {
    const id = parseInt(feature.properties.camera_id);
    const statusMatch = statuses.find(
      (status) => parseInt(status.device_id) === id
    );
    feature.properties.status = simplifyStatus(statusMatch?.status_desc);
  });
};

export default function TrafficCameras() {
  const { data: geojson, loading, error } = useSocrata({ ...CAMERAS_QUERY });

  const {
    data: statuses,
    loading: loadingComm,
    error: errorComm,
  } = useSocrata({ ...CAMERA_COMM_STATUS_QUERY });

  useMemo(() => {
    if (loading || loadingComm || error || errorComm) return;
    return updateFeaturesWithCommStatus({ geojson, statuses });
  }, [geojson, statuses, loading, loadingComm, error, errorComm]);

  return (
    <MapList
      filterSettings={FILTER_SETTINGS}
      searchSettings={SEARCH_SETTINGS}
      geojson={geojson}
      loading={loading || loadingComm}
      error={error || errorComm}
      PopUpContent={PopUpContent}
      PopUpHoverContent={PopUpHoverContent}
      ListItemContent={ListItemContent}
      InfoContent={InfoContent}
      layerStyles={LAYER_STYLES}
      title="Traffic cameras"
    />
  );
}
