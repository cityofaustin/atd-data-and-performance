import { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

export default function Thumbnail({ cameraId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const src = `https://cctv.austinmobility.io/image/${cameraId}.jpg`;

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [cameraId]);

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      aria-label="Full size image of camera thumbnail"
    >
      {!error && (
        <Image
          className={loading ? "d-none" : ""}
          alt="Image from traffic camera"
          onError={() => {
            setError(true);
          }}
          onLoad={() => setLoading(false)}
          src={src}
          fluid
        />
      )}
    </a>
  );
}
