import { useState } from "react";
import Button from "react-bootstrap/Button";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

/**
 * A styled button for the filter toggle. All props are passed to the
 * react-bootstrap Button component
 **/
const FilterToggle = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Button
      {...props}
      className="filter-button-toggle"
      onClick={() => {
        props.onClick();
        setIsExpanded(!isExpanded);
      }}
    >
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex align-items-center">
          <span className="me-1">Filter</span>
          {!isExpanded ? <FaCaretDown /> : <FaCaretUp />}
        </div>
      </div>
    </Button>
  );
};

export default FilterToggle;
