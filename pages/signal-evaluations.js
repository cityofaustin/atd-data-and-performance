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
  useGroupByLocation,
  getMapIcon,
} from "../page-settings/signal-evaluations";
import PageHead from "../components/PageHead";

/**
 * Dashboard that displays traffic signal evaluations
 */
export default function SignalEvaluations() {
  const {
    data: studies,
    loading,
    error,
  } = useSocrata({ ...SIGNAL_EVALUATIONS_QUERY });
  const geojson = useGroupByLocation(studies);

  return (
    <>
      <PageHead
        title="Traffic signal evaluations"
        description="The description"
        pageRoute="signal-evaluations"
        imageRoute="assets/phb.jpg"
      />
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
        getMapIcon={getMapIcon}
        featurePk="atd_location_id"
      />
    </>
  );
}
