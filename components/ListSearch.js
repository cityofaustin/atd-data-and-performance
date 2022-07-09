import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import CheckboxFilters from "./CheckboxFilters";

/**
 * A styled button for the filter toggle. All props are passed to the
 * react-bootstrap Button component
 **/
const FilterButton = (props) => {
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

export default function ListSearch({
  filters,
  setFilters,
  setSelectedFeature,
  hasSelectedFeature,
}) {
  const handleChange = (e) => {
    // nullify selected feature when typing in search box
    // ensures map popup is removed as features are filtered
    hasSelectedFeature && setSelectedFeature(null);
    let currentFilters = { ...filters };
    currentFilters.search.value = e.target.value;
    setFilters(currentFilters);
  };
  return (
    <>
      <Navbar expand="xs">
        <Container fluid>
          <InputGroup className="mb-1">
            <InputGroup.Text id="basic-addon1">
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              name={filters.search.label}
              type="search"
              placeholder={filters.search.placeholder}
              onChange={handleChange}
              value={filters.search.value}
            />
            {filters.checkbox && (
              <Navbar.Toggle
                as={FilterButton}
                aria-controls="basic-navbar-nav"
              />
            )}
          </InputGroup>
          {filters.checkbox && (
            <Navbar.Collapse
              timeout={100}
              id="checkbox-filter-nav"
              className="pb-2"
            >
              <CheckboxFilters filters={filters} setFilters={setFilters} />
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
    </>
  );
}
