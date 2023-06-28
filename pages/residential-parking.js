import { useState } from "react";
import PageHead from "../components/PageHead";
import Nav from "../components/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { US_STATES } from "../page-settings/residential-parking";

export const getServerSideProps = async () => {
  // const res = await fetch(process.env.PASSPORT_AUTH_ENDPOINT, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     grant_type: "client_credentials",
  //     client_id: process.env.PASSPORT_CLIENT_ID,
  //     client_secret: process.env.PASSPORT_CLIENT_SECRET,
  //     audience: "public.api.passportinc.com",
  //   }),
  // });
  // const bearerToken = await res.json();
  const bearerToken = null;
  return { props: { bearerToken } };
};

export default function ResidentialParking({ bearerToken }) {
  const [form, setForm] = useState({
    plate: "",
    state: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(form);
  };

  const handleClear = (event) => {
    setForm({
      plate: "",
      state: "",
    });
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
      </Container>
    </>
  );
}
