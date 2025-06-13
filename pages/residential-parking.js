import { useState } from "react";
import PageHead from "../components/PageHead";
import Nav from "../components/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { FaCheckSquare } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";

import { US_STATES } from "../page-settings/residential-parking";

export default function ResidentialParking({ bearerTokenObj }) {
  // todo: consider renaming state to licenseState
  const [form, setForm] = useState({
    plate: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, showResult] = useState(false);
  const [permitted, setPermitted] = useState(true);

  const checkPermit = () => {
    setLoading(true);
    let queryURL = `/api/passport?vehicle_plate=${form.plate}`;
    if (form.state.length > 0) {
      queryURL = queryURL + `&vehicle_state=${form.state}`;
    }
    fetch(queryURL)
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          setLoading(false);
          // show error?
          return response.status + " " + response.statusText;
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        showResult(true);
        console.log(data);
        if (data.data) {
          setPermitted(data.data.length > 0);
        } else {
          setPermitted(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    showResult(false);
    setLoading(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkPermit();
  };

  const handleClear = (event) => {
    fetch("/api/check")
      .then((response) => response.json())
      .then((data) => console.log(data));
    setForm({
      plate: "",
      state: "",
    });
    showResult(false);
    setLoading(false);
  };

  return (
    <>
      <PageHead
        title="Residential Parking"
        description="License plate permit lookup for Residential Parking"
        pageRoute="/residential-parking"
        imageRoute="/assets/traffic-cameras.jpg"
      />
      <Nav />
      <Container>
        <Row>
          <Col>
            <h5>
              Please enter a license plate below to verify parking eligibility.
            </h5>
          </Col>
        </Row>
        <Row className="my-3">
          <Form>
            <Form.Group className="mb-3" controlId="formLicensePlate">
              <Row>
                <Col className="col col-sm-2">
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control
                    type="text"
                    name="plate"
                    value={form.plate}
                    placeholder="ex: ADR5476"
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col className="col col-sm-1">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  >
                    <option value=""> </option>
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.text}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!form.plate}
              className="me-2"
            >
              Submit
            </Button>
            <Button variant="outline-secondary" onClick={handleClear}>
              Clear
            </Button>
          </Form>
        </Row>

        {loading ? (
          <Row className="my-3">
            <Spinner animation="border" variant="secondary" />
          </Row>
        ) : (
          result && (
            <>
              <Row className="my-3">
                <Col>
                  <span>
                    {permitted ? (
                      <FaCheckSquare color="green" size="1.5em" />
                    ) : (
                      <FaTimesCircle />
                    )}
                  </span>
                  Vehicle with license plate{" "}
                  <span className="fw-bold">{form.plate}</span> is{" "}
                  {!permitted && "not "}
                  permitted
                </Col>
              </Row>
              <Row>
                <p>
                  For any inquires regarding vehicles that are not permitted
                  please refer to the Residential Parking Permit{" "}
                  <a href="https://www.austintexas.gov/department/residential-permit-parking">
                    webpage
                  </a>{" "}
                  frequently asked questions.
                </p>
              </Row>
            </>
          )
        )}
      </Container>
    </>
  );
}
