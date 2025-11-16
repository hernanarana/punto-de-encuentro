import PropTypes from "prop-types";

export default function MobileSortSheet({ open, onClose, value="relevantes", onChange=()=>{} }) {
  const options = [
    { value:"relevantes", label:"Más relevantes" },
    { value:"menor", label:"Menor precio" },
    { value:"mayor", label:"Mayor precio" },
  ];

  return (
    <>
      <div className={`sheet ${open ? "sheet--open" : ""}`} aria-hidden={!open}>
        <div className="sheet__head">
          <button className="icon-btn" onClick={onClose} aria-label="Volver">←</button>
          <strong>Ordenar por</strong>
        </div>
        <div className="sheet__body">
          {options.map(opt => (
            <button
              key={opt.value}
              className={`sheet__item ${value===opt.value ? "is-active":""}`}
              onClick={() => { onChange(opt.value); onClose(); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {open && <div className="overlay" onClick={onClose} />}
    </>
  );
}

MobileSortSheet.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func
};
