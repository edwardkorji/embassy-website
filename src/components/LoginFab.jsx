import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

// Devices without real hover (touch/mobile) can't "hover to preview" the
// fab the way a mouse can, so a single tap would otherwise fire the link
// immediately with no chance to notice it first. On those devices we gate
// the first tap into just expanding the label — a second tap (now that
// it's obviously a link) actually navigates. Desktop keeps single-click,
// since :hover already previews it before any click happens.
function isTouchDevice() {
  return typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function LoginFab() {
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef(null);

  useEffect(() => {
    if (!expanded) return;

    const collapse = () => setExpanded(false);
    const onOutsideClick = (e) => {
      if (!e.target.closest?.(".login-fab")) collapse();
    };

    document.addEventListener("pointerdown", onOutsideClick);
    collapseTimer.current = setTimeout(collapse, 3500);

    return () => {
      document.removeEventListener("pointerdown", onOutsideClick);
      clearTimeout(collapseTimer.current);
    };
  }, [expanded]);

  const handleClick = (e) => {
    if (!isTouchDevice()) return; // desktop: hover already previews it, single click navigates

    if (!expanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <Link
      to="/login"
      className={`login-fab${expanded ? " expanded" : ""}`}
      aria-label="Staff login"
      onClick={handleClick}
    >
      <Lock size={18} />
      <span className="login-fab-label">Staff Login</span>
    </Link>
  );
}

export default LoginFab;
