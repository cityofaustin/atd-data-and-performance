import Form from "react-bootstrap/Form";
import { FaCircle } from "react-icons/fa";

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

export default function CheckboxFilters({
  filters,
  setFilters,
  featureCounts,
}) {
  const onChange = (filter) => {
    const currentFilters = [...filters];
    const thisFilter = currentFilters.find((f) => f.key == filter.key);
    thisFilter.checked = !thisFilter.checked;
    setFilters(currentFilters);
  };

  return (
    <Form>
      {filters.map((filter) => (
        <div
          key={filter.key}
          className="d-flex flex-column align-items-between flex-shrink-0 border-bottom py-2 filter-toggle-wrapper "
          style={{ cursor: "pointer" }}
          onClick={() => onChange(filter)}
        >
          {/* Check component is readyOnly b/c state is controlled by parent div handler */}
          <Form.Check
            id={filter.key}
            label={
              <FilterLabel {...filter} count={featureCounts[filter.key]} />
            }
            checked={filter.checked}
            style={{ cursor: "pointer", pointerEvents: "none" }}
            readOnly
          />
        </div>
      ))}
    </Form>
  );
}
