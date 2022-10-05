export const CAMERAS_QUERY = {
  resourceId: "b4k4-adkb",
  format: "geojson",
  args: [
    { key: "limit", value: "9999999999" },
    {
      key: "order",
      value: "location_name asc",
    },
    {
      key: "select",
      value: "location_name,location,camera_id,screenshot_address",
    },
    {
      key: "where",
      value: "camera_status in ('TURNED_ON')",
    },
  ],
};

/**
 * This query fetches the most recent 3k status records from our device status dataset:
 * https://data.austintexas.gov/Transportation-and-Mobility/Traffic-Signal-Network-Device-Status-Log/pj7k-98z2
 *
 * This query somewhat lazily fetches the most recent 3k camera status records by date
 * descending. There are currently ~1,500 cameras, so we will have multiple status
 * records per camera. A more sophisticated implementation would add an intermediary
 * step of first fetching from this dataset the most recent date for which we have
 * camera statuses, then using that value to query these statuses for the given
 * date. That would entail using a custom hook which dynamically sets the `where`
 * clause of this query.
 */
export const CAMERA_COMM_STATUS_QUERY = {
  resourceId: "pj7k-98z2",
  format: "json",
  args: [
    { key: "limit", value: "3000" },
    {
      key: "order",
      value: "timestamp desc",
    },
    {
      key: "select",
      value: "device_id,status_desc,timestamp",
    },
    {
      key: "where",
      value: "device_type = 'camera'",
    },
  ],
};

export const SIGNAL_STATUS_QUERY = {
  resourceId: "5zpr-dehc",
  format: "geojson",
  args: [
    {
      key: "order",
      value: "location_name asc",
    },
    {
      key: "limit",
      value: "99999999",
    },
  ],
};

export const SIGNAL_EVALUATIONS_QUERY = {
  resourceId: "h4cy-hpgs",
  format: "geojson",
  args: [
    {
      key: "limit",
      value: "99999999",
    },
    {
      key: "order",
      value: "location_name asc",
    },
    {
      key: "select",
      value:
        "atd_location_id,location_name,location_status_simple,council_district,location,modified_date,study_date,study_type",
    },
  ],
};
