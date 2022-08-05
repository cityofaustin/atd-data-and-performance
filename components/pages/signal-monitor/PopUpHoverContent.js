import { shortenLocationName } from "../../../utils/helpers";

const PopUpHoverContent = ({ feature }) => {
  return (
    <div className="p-1 m-1">
      <span className="fs-6 fw-bold">
        {shortenLocationName(feature.properties.location_name)}
      </span>
    </div>
  );
};

export default PopUpHoverContent;
