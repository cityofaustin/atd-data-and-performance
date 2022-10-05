import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import CheckboxFilters from "./CheckboxFilters";
import FilterToggle from "./FilterToggle";

export default function ListSearch({
  filters,
  setFilters,
  searchValue,
  setSearchValue,
  searchSettings,
  setSelectedFeature,
  hasSelectedFeature,
  featureCounts,
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
          <InputGroup>
            <InputGroup.Text>
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              name="search"
              type="search"
              placeholder={searchSettings.placeholder}
              onChange={handleSearchInputChange}
              value={searchValue}
            />
            {filters && (
              <Navbar.Toggle
                as={FilterToggle}
                aria-controls="map-filter-menu-toggle"
              />
            )}
          </InputGroup>
          {filters && (
            <Navbar.Collapse
              timeout={100}
              className="border-bottom border-dark"
            >
              <CheckboxFilters
                filters={filters}
                setFilters={setFilters}
                featureCounts={featureCounts}
              />
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
    </>
  );
}
