export default function FlexyInfo({ label, value }) {
  return (
    <div className="d-flex justify-content-between">
      <span className="fw-bold">{label}</span>
      <span>{value}</span>
    </div>
  );
}
