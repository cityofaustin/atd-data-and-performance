import Link from "next/link";
import Card from "react-bootstrap/Card";

export default function NavTile({ href, title, description, img }) {
  return (
    <Link className="text-decoration-none" href={href} passHref>
      <Card className="h-100 nav-tile">
        {img && <Card.Img variant="top" alt={img.alt} src={img.src} />}
        <Card.Body className="p-3 lh-1">
          <Card.Title className="fw-bold fs-6 text-primary">{title}</Card.Title>
          <span className="text-muted ">
            <small>{description}</small>
          </span>
        </Card.Body>
      </Card>
    </Link>
  );
}
