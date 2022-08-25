import Form from "react-bootstrap/Form";
import FilterLabel from "./FilterLabel";
import typedefs from "../typedefs";

/**
 * Filter component which controls which map + list features are rendered
 * @param {[typedefs.FilterSetting]} filters - an array of FilterSetting objects
 * @param {function} setFilters - function which updates the state of filters
 * @param {object} featureCounts - an objects which holds counts of features matching
 *   each filter key.
 */
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
