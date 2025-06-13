import Link from "next/link";
import Card from "react-bootstrap/Card";
import { FaExternalLinkAlt } from "react-icons/fa";

const ExternalLinkTitle = ({ title }) => (
  <div className={`d-flex flex-column`}>
    <div className="d-flex align-items-center">
      <span className="me-1">{title}</span>
      <span className="text-muted" style={{ fontSize: ".75rem" }}>
        <FaExternalLinkAlt />
      </span>
    </div>
  </div>
);

export default function NavTile({ href, title, description, img, external }) {
  const anchorProps = external
    ? {
        target: "_blank",
        rel: "noreferrer",
      }
    : {};
  return (
    <>
      <Link className="text-decoration-none" href={href} passHref>
        <a className="text-decoration-none" {...anchorProps}>
          <Card className="h-100 nav-tile">
            {img && <Card.Img variant="top" alt={img.alt} src={img.src} />}
            <Card.Body className="p-3 lh-1">
              <Card.Title className="fw-bold fs-6 text-primary">
                {external ? <ExternalLinkTitle title={title} /> : title}
              </Card.Title>
              <span className="text-muted ">
                <small>{description}</small>
              </span>
            </Card.Body>
          </Card>
        </a>
      </Link>
    </>
  );
}
