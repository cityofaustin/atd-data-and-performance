export default function FlexyInfo({ label, value }) {
  return (
    <div className="d-flex w-100 justify-content-between text-dts-dark-gray">
      <p className="my-0">
        <small>{label}</small>
      </p>
      <p className="my-0">
        <small>{value}</small>
      </p>
    </div>
  );
}
