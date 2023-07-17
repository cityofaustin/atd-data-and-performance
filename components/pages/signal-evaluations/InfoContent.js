import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaCalculator,
  FaCheckSquare,
  FaDollarSign,
  FaTools,
} from "react-icons/fa";

export default function InfoContent() {
  return (
    <Row className="justify-content-center">
      <Col>
        <h6>
          <FaMapMarkerAlt className="me-1 text-secondary" /> Identification
        </h6>
        <p>
          A location is identified for posssible signalization. The location may
          have been requested by a resident (via 311), identified by City staff,
          or identified through the permitting process for a private
          development.
        </p>

        <h6>
          <FaCalculator className="me-1 text-secondary" /> Evaluation
        </h6>
        <p>
          All locations undergo an evaluation process, which consists of an
          initial assessment which considers crash history, traffic volumes,
          pedestrian activity, equity, and other factors in the built
          environment. A subset of these locations are selected for an
          engineering study, in which a Professional Engineer conducts an
          in-depth analysis of the location to determine if signalization is
          warranted.
        </p>

        <h6>
          <FaCheckSquare className="me-1 text-secondary" /> Recommendation
        </h6>
        <p>
          The evaluation process concludes with an engineer&apos;s
          recommendation to construct a traffic or pedestrain signal. If
          signalization is recommended, the City may proceed to construct a
          signal at the location.
        </p>

        <h6>
          <FaDollarSign className="me-1 text-secondary" />
          Funding
        </h6>
        <p>
          The City funds traffic signal construction through a variety of
          sources, including its operating budget, grants, and private
          developers (as may be required through the development review
          processs).
        </p>

        <h6>
          <FaTools className="me-1 text-secondary" />
          Construction
        </h6>
        <p>
          When a location has been recommended for signalization and funding has
          been secured, the Austin Transportation and Public Works oversees the
          construction of a new signal. Time to completion varies based on staff
          resources, design constraints, as well as conflicting roadway projects
          at the signal location. You can track the status of signal
          construction projects with <a>this dashboard</a>.
        </p>
      </Col>
    </Row>
  );
}
