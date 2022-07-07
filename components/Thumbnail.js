import { useState } from "react";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

export default function Thumbnail({ cameraId }) {
  const [loading, setLoading] = useState(true);
  const src = `https://cctv.austinmobility.io/image/${cameraId}.jpg`;
  return (
    <>
      {loading && (
        <Spinner className="text-secondary" animation="border" role="status" />
      )}
      <Image
        className={loading ? "d-none" : ""}
        alt="Image from traffic camera"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/unavailable.jpg";
        }}
        onLoad={() => setLoading(false)}
        src={src}
        fluid
      />
    </>
  );
}
