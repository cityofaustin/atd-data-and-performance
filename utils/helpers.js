import { useEffect, useMemo } from "react";

/**
 * Shorten a Data Tracker location name, which follows < primary st / cross st (landmark) > pattern
 * by removing the (landmark)
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

export const useHiddenOverflow = () => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);
};
