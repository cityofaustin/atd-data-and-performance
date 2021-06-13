import React, { useRef, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { BsSearch } from "react-icons/bs";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Map, { easeToFeature } from "./Map";
import Table from "./Table";
import styles from "../../styles/Map.module.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const CheckBoxFilters = ({ filters, setFilters }) => {
  const onChange = (filter) => {
    let currentFilters = { ...filters };
    currentFilters.checkbox.some((f) => {
      if (f.key == filter.key) {
        f.checked = !f.checked;
        return true;
      }
    });
    setFilters(currentFilters);
  };

  return (
    <Form>
      {filters.checkbox.map((f) => (
        <div key={f.key} style={{ cursor: "pointer" }}>
          <Form.Check
            type="switch"
            id={f.key}
            label={f.label}
            checked={f.checked}
            onChange={() => onChange(f)}
            className="text-dts-primary"
          />
        </div>
      ))}
    </Form>
  );
};

const FilterButton = (props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <Button
      id="filter-button-toggle"
      {...props}
      onClick={() => {
        props.onClick();
        setIsExpanded(!isExpanded);
      }}
    >
      Filter
      {!isExpanded ? <FaCaretDown /> : <FaCaretUp/>}
    </Button>
  );
};

const TableSearch = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    let currentFilters = { ...filters };
    currentFilters.search.value = e.target.value;
    setFilters(currentFilters);
  };

  return (
    <>
      <Navbar expand="xs" className="py-1">
        <Container fluid className="px-0">
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              size="sm"
              key={filters.search.key}
              name={filters.search.label}
              type="search"
              placeholder={filters.search.placeholder}
              onChange={handleChange}
            />
            <Navbar.Toggle as={FilterButton} aria-controls="basic-navbar-nav" />
          </InputGroup>
          <Navbar.Collapse timeout={100} id="basic-navbar-nav">
            <CheckBoxFilters filters={filters} setFilters={setFilters} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

const stringIncludes = (val, str) => {
  return str.toLowerCase().includes(val.toLowerCase());
};

const useFilters = ({ geojson, filterDefs }) => {
  const [filters, setFilters] = React.useState(filterDefs);
  const [filteredGeosjon, setFilteredGeojson] = React.useState(geojson);
  React.useEffect(() => {
    let currentGeojson = { ...geojson };
    let currentCheckedFilters = filters.checkbox.filter((f) => f.checked);
    let currentSearchVal = filters.search.value;
    if (
      (currentCheckedFilters || currentSearchVal) &&
      currentGeojson?.features
    ) {
      const filteredFeatures = currentGeojson.features.filter((feature) => {
        return (
          currentCheckedFilters.some((filter) => {
            return filter.value === feature.properties[filter.featureProp];
          }) &&
          stringIncludes(
            currentSearchVal,
            feature.properties[filters.search.featureProp]
          )
        );
      });
      currentGeojson.features = filteredFeatures;
    }
    setFilteredGeojson(currentGeojson);
  }, [geojson, filters]);
  return [filteredGeosjon, filters, setFilters];
};


export default function GeoTable({ geojson, headers, layerStyle, filterDefs }) {
  const [selectedFeature, setSelectedFeature] = React.useState(null);
  const [filteredGeosjon, filters, setFilters] = useFilters({
    geojson,
    filterDefs,
  });
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const onRowClick = (feature) => {
    if (feature) {
      easeToFeature(mapRef.current, feature);
      setSelectedFeature(feature);
    } else {
      setSelectedFeature(null);
    }
  };

  const onFeatureClick = (eventData) => {
    const clickedFeature = eventData.features[0];
    setSelectedFeature(clickedFeature);
    easeToFeature(mapRef.current, clickedFeature);
  };

  return (
    <Row style={{ height: "100%" }}>
      {/* table/search */}
      <Col md={5}>
        <Row style={{ height: 500, overflow: "hidden" }}>
          <Col>
            <Row>
              <Col>
                <TableSearch filters={filters} setFilters={setFilters} />
              </Col>
            </Row>
            <Row style={{ height: 500, overflow: "auto" }}>
              <Col>
                <Table
                  features={filteredGeosjon?.features}
                  onRowClick={onRowClick}
                  headers={headers}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      {/* end table/search */}
      {/* map */}
      <Col>
        <Row className="h-100">
          <Col>
            <Map
              geojson={filteredGeosjon}
              layerStyle={layerStyle}
              mapContainerRef={mapContainerRef}
              mapRef={mapRef}
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
              onFeatureClick={onFeatureClick}
            />
          </Col>
        </Row>
      </Col>
      {/*end map*/}
    </Row>
  );
}
