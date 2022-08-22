import { useEffect, useMemo, useState } from "react";

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
 * Custom hook that that applies search value
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
 * Custom hook that that applies checkbox filters
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
