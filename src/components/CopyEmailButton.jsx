import { useState } from "react";

// Reusable "click to copy" email button — used anywhere on the site a Gmail
// link is offered. Falls back to opening the user's mail client if the
// Clipboard API isn't available (e.g. denied permission, insecure context).
function CopyEmailButton({ email, className, ariaLabel, children }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <span className="copy-email-wrap">
      <button
        type="button"
        className={className}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        {children}
      </button>

      <span className="copy-email-tooltip" role="status" data-visible={copied}>
        Copied {email} to clipboard!
      </span>
    </span>
  );
}

export default CopyEmailButton;
