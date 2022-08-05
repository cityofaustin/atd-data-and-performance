/**
 * Provides a vertically-aligned icon with label
 */
export default function IconLabel({ Icon, label, centered }) {
  return (
    <div className={`d-flex flex-column ${centered && "align-items-center"}`}>
      <div className="d-flex align-items-center">
        <Icon />
        <span className="ms-1">{label}</span>
      </div>
    </div>
  );
}
