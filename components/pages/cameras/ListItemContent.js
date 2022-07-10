import { shortenLocationName } from "../../../utils/helpers";

export default function ListItemContent({ feature }) {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <span className="fw-bold">
          {shortenLocationName(feature.properties.location_name)}
        </span>
      </div>
    </>
  );
}
