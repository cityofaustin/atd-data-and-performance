import { useState } from "react";
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
  searchValue,
  setSearchValue,
  searchSettings,
  setSelectedFeature,
  hasSelectedFeature,
}) {
  const handleSearchInputChange = (e) => {
    // nullify selected feature when typing in search box
    // ensures map popup is removed as features are filtered
    hasSelectedFeature && setSelectedFeature(null);
    setSearchValue(e.target.value);
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
              name={searchSettings.label}
              type="search"
              placeholder={searchSettings.placeholder}
              onChange={handleSearchInputChange}
              value={searchValue}
            />
            {filters && (
              <Navbar.Toggle
                as={FilterButton}
                aria-controls="basic-navbar-nav"
              />
            )}
          </InputGroup>
          {filters && (
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
