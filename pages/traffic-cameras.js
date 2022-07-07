import { useMemo } from "react";
import MapList from "../components/MapList";
import PopUpContent from "../components/pages/cameras/PopUpContent";
import DetailsContent from "../components/pages/cameras/DetailsContent";
import ListItem from "../components/pages/cameras/ListItem";
import { useSocrata } from "../utils/socrata";
import { CAMERAS_QUERY, CAMERA_COMM_STATUS_QUERY } from "../utils/queries";
import { FILTERS, LAYER_STYLES } from "../page-settings/traffic-cameras";

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
  }, [geojson, statuses]);

  if (loading || loadingComm || error || errorComm) {
    return <p>Loading or error....</p>;
  }

  return (
    <MapList
      initialFilters={FILTERS}
      geojson={geojson}
      loading={loading}
      error={error}
      PopUpContent={PopUpContent}
      DetailsContent={DetailsContent}
      ListItem={ListItem}
      layerStyles={LAYER_STYLES}
    />
  );
}