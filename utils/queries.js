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
      value:
        "location_name,location,camera_id,screenshot_address",
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
    { key: "limit", value: "2000" },
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
