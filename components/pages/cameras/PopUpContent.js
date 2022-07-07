import { shortenLocationName } from "../../../utils/helpers";

const PopUpContent = ({ feature }) => {
  return <span>{shortenLocationName(feature.properties.location_name)}</span>;
};

export default PopUpContent;
