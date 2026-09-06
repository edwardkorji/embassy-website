function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant} ${className}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="dashboard-spinner dashboard-spinner--sm" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default Button;
