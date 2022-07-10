import Form from "react-bootstrap/Form";

export default function CheckboxFilters({ filters, setFilters }) {
  const onChange = (filter) => {
    let currentFilters = { ...filters };
    currentFilters.checkbox.some((f) => {
      if (f.key == filter.key) {
        f.checked = !f.checked;
        return true;
      }
    });
    // force all checkboxes to be checked if none are. prevents user from enabling all, resulting in a blank map
    if (
      currentFilters.checkbox.every((f) => {
        return !f.checked;
      })
    ) {
      currentFilters.checkbox.forEach((f) => {
        f.checked = true;
      });
    }
    setFilters(currentFilters);
  };

  return (
    <Form>
      {filters.checkbox.map((filter) => (
        <div
          key={filter.key}
          style={{ cursor: "pointer" }}
          onClick={() => onChange(filter)}
        >
          <Form.Check
            type="switch"
            id={filter.key}
            label={filter.label}
            checked={filter.checked}
            onChange={() => onChange(filter)}
            className="text-primary"
          />
        </div>
      ))}
    </Form>
  );
}
