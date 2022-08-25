import PageHead from "../components/PageHead";
import MapList from "../components/MapList";
import PopUpHoverContent from "../components/pages/cameras/PopUpHoverContent";
import PopUpContent from "../components/pages/cameras/PopUpContent";
import ListItemContent from "../components/pages/cameras/ListItemContent.js";
import InfoContent from "../components/pages/cameras/InfoContent";
import { useSocrata } from "../utils/socrata";
import {
  CAMERAS_QUERY,
  CAMERA_COMM_STATUS_MAX_DATE,
  CAMERA_COMM_STATUS_QUERY,
} from "../utils/queries";
import {
  FILTER_SETTINGS,
  SEARCH_SETTINGS,
  LAYER_STYLES,
  useCommStatus,
  useMaxDateQuery,
} from "../page-settings/traffic-cameras";

/**
 * Dashboard that shows traffic cameras with their communication status.
 * This page uses two data sources: the camera asset records, as well as the
 * camera device statuses, which are updated daily. See ../utils/queries for
 * info about these statuses.
 */

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
