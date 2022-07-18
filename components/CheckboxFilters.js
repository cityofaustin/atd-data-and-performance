import Form from "react-bootstrap/Form";
import { FaCircle } from "react-icons/fa";

const FilterLabel = ({ color, label }) => (
  <div className="d-flex align-items-center">
    <span className="me-1">{label}</span>
    <span style={{ color: color }}>
      <FaCircle />
    </span>
  </div>
);

export default function CheckboxFilters({ filters, setFilters }) {
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
          className="d-flex flex-column align-items-center flex-shrink-0 border-bottom py-2 filter-toggle-wrapper "
          style={{ cursor: "pointer" }}
          onClick={() => onChange(filter)}
        >
          <Form.Check
            id={filter.key}
            label={<FilterLabel {...filter} />}
            checked={filter.checked}
            style={{ cursor: "pointer", pointerEvents: "none" }}
          />
        </div>
      ))}
    </Form>
  );
}
