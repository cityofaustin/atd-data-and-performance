import { useMemo } from "react";
import {
  FaRegTimesCircle,
  FaTimes,
  FaCheckCircle,
  FaCheck,
  FaCalculator,
  FaDollarSign,
} from "react-icons/fa";

const COLORS = {
  one: "#08306b",
  two: "#08306b",
  three: "#14376c",
  four: "#08306b",
};

export const FILTER_SETTINGS = [
  {
    key: "Not recommended",
    value: "Not recommended",
    featureProp: "location_status_simple",
    label: "Not recommended",
    checked: true,
    color: COLORS.zero,
    icon: FaRegTimesCircle,
    mapIcon: FaTimes,
  },
  {
    key: "Engineering study",
    value: "Engineering study",
    featureProp: "location_status_simple",
    label: "Engineering study",
    checked: true,
    color: COLORS.two,
    icon: FaCalculator,
    mapIcon: FaCalculator,
  },

  {
    key: "Needs funding",
    value: "Recommended (needs funding)",
    featureProp: "location_status_simple",
    label: "Needs funding",
    checked: true,
    color: COLORS.three,
    icon: FaDollarSign,
    mapIcon: FaDollarSign,
  },
  {
    key: "Ready for design",
    value: "Ready for design",
    featureProp: "location_status_simple",
    label: "Ready for design",
    checked: true,
    color: COLORS.five,
    icon: FaCheckCircle,
    mapIcon: FaCheck,
  },
];

export const SEARCH_SETTINGS = {
  featureProp: "location_name",
  placeholder: "Search by location...",
};

export const LAYER_STYLES = {
  paint: {
    "circle-color": [
      "match",
      ["get", "location_status_simple"],
      "Not recommended",
      COLORS.one,
      "Engineering study",
      COLORS.two,
      "Recommended (needs funding)",
      COLORS.three,
      "Ready for design",
      COLORS.four,
      // fallback
      "#ccc",
    ],
  },
};

export const getSettings = (feature) => {
  return FILTER_SETTINGS.find(
    (setting) => feature.properties.location_status_simple === setting.value
  );
};

export const getMapIcon = (feature) => {
  const setting = FILTER_SETTINGS.find(
    (setting) => feature.properties.location_status_simple === setting.value
  );
  return setting.mapIcon;
};

/**
 * Group taffic signal study records by location. A location may have many studies,
 * so we merge them based on their `atd_location_id` key. The map/list displays location
 * records with info about the related studies.
 * @param {object} studies - a geojson FeatureCollection of signal studies, fetched from socrata
 * @returns {object} - a geojson FeatureCollection of `locations`
 */
export const useGroupByLocation = (studies) =>
  useMemo(() => {
    if (!studies) return;
    const locationProps = [
      "atd_location_id",
      "location_name",
      "location_status_simple",
      "council_district",
    ];

    // create an index of all distinct locations
    const locationIndex = studies.features.reduce((locationIndex, feature) => {
      // atd_location_id is the location pk
      const { atd_location_id } = feature.properties;

      if (atd_location_id && locationIndex[atd_location_id]) {
        // location already indexed, so append this study to it
        locationIndex[atd_location_id].properties.studies.push({
          ...feature.properties,
        });
        return locationIndex;
      }

      // copy the study, which we use as our new location feature
      const location = {
        type: "Feature",
        geometry: feature.geometry,
        properties: { ...feature.properties },
      };

      // remove all properties except location attributes
      Object.keys(feature.properties).forEach((prop) => {
        if (!locationProps.includes(prop)) {
          delete location.properties[prop];
        }
      });

      // and copy the study feature props - we'll need those in the map popup
      location.properties.studies = [{ ...feature.properties }];
      locationIndex[atd_location_id] = location;

      return locationIndex;
    }, {});

    // unpack the location features
    const features = Object.values(locationIndex);

    // set location modified date from most-recent study modified date
    features.forEach((feature) => {
      const studyDates = feature.properties.studies.map(
        (study) => study.modified_date
      );
      studyDates.reverse();
      feature.properties.modified_date = studyDates?.[0];
    });
    // return locations within a new FeatureCollection
    return {
      type: "FeatureCollection",
      features: [...features],
    };
  }, [studies]);
