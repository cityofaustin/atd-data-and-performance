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

export const CAMERA_COMM_STATUS_QUERY = {
  resourceId: "pj7k-98z2",
  format: "json",
  args: [
    { key: "limit", value: "999999" },
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
  resourceId: "fnxd-mtmb",
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
      value: "atd_location_id,location_name,location_status,council_district,location,modified_date",
    },
    {
      key: "where",
      value: "lower(location_status) in ('archived', 'ineligible', 'recently received', 'evaluated', 'study in progress', 'selected for study', 'not recommended', 'recommended (needs funding)', 'recommended (funded)')",
    },
  ],
};
