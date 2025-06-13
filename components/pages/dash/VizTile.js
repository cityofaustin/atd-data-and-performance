import Card from "react-bootstrap/Card";
import { FaLock } from "react-icons/fa";

function InternalDatasetTitle({ title }) {
  return (
    <div className={`d-flex flex-column`}>
      <div className="d-flex align-items-center">
        <span className="me-1">{title}</span>
        <span className="text-muted" style={{ fontSize: ".75rem" }}>
          <FaLock />
        </span>
      </div>
    </div>
  );
}

export default function VizTile({
  href,
  title,
  description,
  imgSrc,
  imgAltText,
  publiclyAccessible,
}) {
  return (
    <a
      className="text-decoration-none"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Card className="h-100 nav-tile">
        {imgSrc ? (
          <Card.Img variant="top" alt={imgAltText} src={imgSrc} />
        ) : (
          <Card.Img
            variant="top"
            alt="No image available"
            src="../assets/laptop_data_pres_logo.png"
            height="150px"
          />
        )}
        <Card.Body className="p-3 lh-1">
          <Card.Title className="fw-bold fs-6 text-primary">
            {!publiclyAccessible ? (
              <InternalDatasetTitle title={title} />
            ) : (
              title
            )}
          </Card.Title>
          <span className="text-muted ">
            <small>{description}</small>
          </span>
        </Card.Body>
      </Card>
    </a>
  );
}
