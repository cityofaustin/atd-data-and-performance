import { useMemo } from "react";
import PageHead from "../components/PageHead";
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

const useCommStatus = ({ cameras, statuses }) =>
  useMemo(() => {
    if (!cameras || !statuses) {
      return;
    }
    // we're updating cameras in-place, but we want to return a new reference
    // to control loading / render state
    cameras.features.forEach((feature) => {
      const id = parseInt(feature.properties.camera_id);
      const statusMatch = statuses.find(
        (status) => parseInt(status.device_id) === id
      );
      feature.properties.status = simplifyStatus(statusMatch?.status_desc);
    });
    return cameras;
  }, [cameras, statuses]);

export default function TrafficCameras() {
  const { data: cameras, error } = useSocrata({ ...CAMERAS_QUERY });

  const { data: statuses, error: errorComm } = useSocrata({
    ...CAMERA_COMM_STATUS_QUERY,
  });

  const geojson = useCommStatus({ cameras, statuses });

  // todo: handle errrors
  return (
    <>
      <PageHead
        title="Traffic cameras"
        description="Live images from the City of Austin's traffic cameras"
        pageRoute="traffic-cameras"
        imageRoute="assets/traffic-cameras.jpg"
      />
      <MapList
        filterSettings={FILTER_SETTINGS}
        searchSettings={SEARCH_SETTINGS}
        geojson={geojson}
        loading={!geojson}
        error={error || errorComm}
        PopUpContent={PopUpContent}
        PopUpHoverContent={PopUpHoverContent}
        ListItemContent={ListItemContent}
        InfoContent={InfoContent}
        layerStyles={LAYER_STYLES}
        title="Traffic cameras"
        featurePk="camera_id"
      />
    </>
  );
}
