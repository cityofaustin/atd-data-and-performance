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
 * Custom hook that that applies search and checkbox filter states to geojson features
 **/
export const useFilteredGeojson = ({ geojson, filters }) =>
  useMemo(() => {
    if (!geojson?.features) return;
    const filteredGeosjon = { ...geojson };
    const currentCheckedFilters = filters.checkbox?.filter((f) => f.checked);
    const currentSearchVal = filters.search?.value;

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
    // apply search term filter
    if (currentSearchVal) {
      filteredGeosjon.features = filteredGeosjon.features.filter((feature) => {
        return stringIncludesCaseInsensitive(
          feature.properties[filters.search.featureProp] || "",
          currentSearchVal
        );
      });
    }
    return filteredGeosjon;
  }, [geojson, filters]);

export const useHiddenOverflow = () => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return function cleanup() {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
};
