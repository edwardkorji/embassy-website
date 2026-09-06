function FormField({ label, error, hint, htmlFor, children }) {
  return (
    <div className={`form-field${error ? " form-field-error" : ""}`}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? (
        <span className="form-error-text">{error}</span>
      ) : hint ? (
        <span className="form-hint">{hint}</span>
      ) : null}
    </div>
  );
}

export default FormField;
