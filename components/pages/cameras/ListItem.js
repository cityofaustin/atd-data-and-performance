import { shortenLocationName } from "../../../utils/helpers";

export default function ListItem({ feature }) {
  return (
    <>
      <div className="d-flex w-100 align-items-center justify-content-between">
        <strong className="mb-1">
          {shortenLocationName(feature.properties.location_name)}
        </strong>
      </div>
    </>
  );
}
