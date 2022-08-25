import { FaCircle } from "react-icons/fa";
import typedefs from "../typedefs";

/**
 * Customizeable checkbox filter label.
 *
 * @param {typedefs.FilterSetting.color}
 * @param {typedefs.FilterSetting.label}
 * @param {typedefs.FilterSetting.icon}
 * @param {integer} count - the number of features which match this filter
 */
const FilterLabel = ({ color, label, count, icon }) => {
  // render a custom icon if provided
  const Icon = icon || FaCircle;
  return (
    <div className="d-flex align-items-center ms-5">
      <Icon style={{ color: color }} />
      <span className="ms-1">{label}</span>
      <span className="ms-1 text-muted">
        <small>{`(${count})`} </small>
      </span>
    </div>
  );
};

export default FilterLabel;
