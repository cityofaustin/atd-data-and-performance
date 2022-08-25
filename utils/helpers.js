import { useEffect, useMemo, useState } from "react";
import { Marker } from "react-map-gl";
import {
  LAYER_STYLE_DEFAULT,
  INITIAL_VIEW_STATE_DEFAULT,
} from "../components/Map/settings";

/**
 * Shorten a Data Tracker location name, which follows < primary st / cross st (landmark) > pattern
 * by removing the (landmark). We do this because location names are otherwise rather long
 */
export const shortenLocationName = (str) => {
  let [name, ...rest] = str.split("(");
  return `${name.trim()}`;
};

/**
 * Case-insensitive test if an input string contains an input value
 */
const stringIncludesCaseInsensitive = (str, val) => {
  return str.toLowerCase().includes(val.toLowerCase());
};

/**
 * Custom hook that that applies search value to a FeatureCollection
 **/
export const useSearchValue = ({ geojson, searchValue, featureProp }) =>
  useMemo(() => {
    if (!geojson?.features || !searchValue) return geojson;
    const filteredGeosjon = { type: "FeatureCollection", features: [] };
    filteredGeosjon.features = geojson.features.filter((feature) => {
      return stringIncludesCaseInsensitive(
        feature.properties[featureProp] || "",
        searchValue
      );
    });
    return filteredGeosjon;
  }, [geojson, searchValue, featureProp]);

/**
 * Custom hook that that applies checkbox filters to a FeatureCollection
 **/
export const useCheckboxFilters = ({ geojson, filters }) =>
  useMemo(() => {
    if (!geojson?.features) return;
    const filteredGeosjon = { type: "FeatureCollection", features: [] };
    const currentCheckedFilters = filters?.filter((f) => f.checked);
    // apply checkbox filters if any exist and are checked
    if (currentCheckedFilters && currentCheckedFilters.length > 0) {
      filteredGeosjon.features = geojson.features.filter((feature) => {
        return (
          // filter is applied by matching feature prop val exactly to filter val
          currentCheckedFilters.some((filter) => {
            return filter.value === feature.properties[filter.featureProp];
          })
        );
      });
    }
    return filteredGeosjon;
  }, [geojson, filters]);

/**
 * Custom hooks that counts the number of features matching each filter
 * @param { object } geojson - a geojson FeatureCollection
 * @param { [object]} filters - an array of FilterSetting objects
 * @returns { object} - An object with one prop per filter in the format { filter.key: count }
 */
export const useFeatureCounts = ({ geojson, filters }) =>
  useMemo(() => {
    if (!geojson?.features) return;
    return filters.reduce((counts, filter) => {
      const key = filter.key;
      const matchingFeatures = geojson.features.filter(
        (feature) => filter.value === feature.properties[filter.featureProp]
      );
      counts[key] = matchingFeatures.length;
      return counts;
    }, {});
    // we don't want to render on `filter` change—these counts are calc'd once and
    // and only once when we have a geojson
    // eslint-disable-next-line
  }, [geojson]);

/**
 * Applies overflow-hidden to the document <body> and removes it when the
 * component unMounts
 */
export const useHiddenOverflow = () => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);
};

/**
 * Hook which determines if the user's device is touch-enabled. Used
 * to control rendering of popup events on touch
 * @returns {bool} - if the device is touch-enabled
 */
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    if ("ontouchstart" in window) {
      /* browser with Touch Events running on touch-capable device */
      setIsTouchDevice(true);
    }
  }, []);
  return isTouchDevice;
};

/**
 * Generates MapGL icon <Markers> which will be overlayed on top of map features.
 *
 * If no `getMapIcon` is supplied, no markers will be created
 * @param {object} geojson - a geojson FeatureCollection
 * @param {function} getMapIcon - a function that accepts a single geojson feature and
 *   returns a react-icon Icon.
 * @param {string} featurePk - the name of the property that uniquely identifies each
 *   geojson feature
 * @returns  { [Marker] } an array of MapGl Marker components
 */
export const useIconMarkers = ({ geojson, getMapIcon, featurePk }) =>
  useMemo(() => {
    if (!geojson || !getMapIcon) return;
    return geojson.features.map((feature) => {
      const Icon = getMapIcon(feature);
      return (
        <Marker
          longitude={feature.geometry.coordinates[0]}
          latitude={feature.geometry.coordinates[1]}
          anchor="center"
          style={{ cursor: "pointer" }}
          key={feature.properties[featurePk]}
        >
          <span className="text-white">
            <Icon style={{ marginBottom: "4px" }} />
          </span>
        </Marker>
      );
    });
  }, [geojson, getMapIcon, featurePk]);

/**
 * Converts a MapGL `viewstate` object into an { x, y, z} object that can be sent
 *   to the browser's URL query.
 */
export const generateNewQueryparams = ({
  longitude: x,
  latitude: y,
  zoom: z,
}) => {
  return {
    x: x.toFixed(6),
    y: y.toFixed(6),
    z: z.toFixed(2),
  };
};

/**
 * Merges custom layer styles into default settings
 * @param {object} layerStyles - a mapbox layer spec object
 * @returns {object} - a mapbox layer spec object
 */
export const applyCustomStyles = (layerStyles) => {
  // merge paint props separately to allow individual paint overrides
  layerStyles.paint = {
    ...LAYER_STYLE_DEFAULT.paint,
    ...(layerStyles.paint || {}),
  };
  // merge any other overrides
  return { ...LAYER_STYLE_DEFAULT, ...layerStyles };
};

/**
 * Hook provides a map's initial view state (ie map center + zoom )
 * Used to optionally handle viewstate data in URL query params
 */
export const useInitialViewState = ({ x, y, z }) =>
  useMemo(() => {
    if (parseFloat(x) && parseFloat(y) && parseFloat(z)) {
      return {
        longitude: parseFloat(x),
        latitude: parseFloat(y),
        zoom: parseFloat(z),
      };
    }
    return INITIAL_VIEW_STATE_DEFAULT;
    /**
     * we only need this to run once, and, to boot, MapGL will ignore the prop
     * after initialization
     */
    // eslint-disable-next-line
  }, []);
