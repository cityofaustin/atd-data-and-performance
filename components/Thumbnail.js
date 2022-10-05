import { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";

const CCTV_IMAGE_BASE_URL = `https://cctv.austinmobility.io/image`;

/**
 * A stateful image component for fetching traffic camera images
 * @param {string} cameraId - the camera's ID
 */
export default function Thumbnail({ cameraId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const src = `${CCTV_IMAGE_BASE_URL}/${cameraId}.jpg`;

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
