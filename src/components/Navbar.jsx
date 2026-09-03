import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#team", label: "Team" },
  { href: "/#news", label: "News" },
  { href: "/#diplomacy", label: "Diplomacy" },
  { href: "/#contact", label: "Contact" },
  // Blog and Reports both glow, offset by half the pulse cycle (see
  // .nav-glow-delayed in index.css) so they alternate — one lit while the
  // other is dark, then they swap.
  { to: "/blog", label: "Blog", glow: true, glowDelay: true },
  { to: "/publications", label: "Reports", glow: true },
];

function NavLink({ link, onClick }) {
  const className = [link.glow && "nav-glow", link.glowDelay && "nav-glow-delayed"]
    .filter(Boolean)
    .join(" ") || undefined;

  if (link.to) {
    return (
      <Link to={link.to} onClick={onClick} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} onClick={onClick} className={className}>
      {link.label}
    </a>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasDarkHero = location.pathname === "/";

  const [scrolled, setScrolled] = useState(!hasDarkHero);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!hasDarkHero) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasDarkHero]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Always land on the hero, regardless of scroll position or which page
  // we're on — a plain <Link to="/"> only resets scroll if the browser
  // happens to; this makes it deterministic every time.
  const goToHero = (e) => {
    e.preventDefault();
    setMenuOpen(false);

    if (location.pathname === "/") {
      document.getElementById("hero")?.scrollIntoView({ block: "start" });
    } else {
      navigate("/#hero");
    }
  };

  return (
    <nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
        menuOpen ? "navbar-menu-open" : ""
      }`}
    >
      <Link
        to="/#hero"
        className="navbar-logo"
        onClick={goToHero}
        aria-label="Go to home"
      >
        <div className="flag-mark">
          <span className="green"></span>
          <span className="white"></span>
          <span className="blue"></span>
        </div>

        <div>
          <p className="logo-country">SIERRA LEONE</p>
          <p className="logo-subtitle">Embassy in Ethiopia</p>
        </div>
      </Link>

      <div className="navbar-links">
        {links.map((link) => (
          <NavLink link={link} key={link.label} />
        ))}
      </div>

      <button
        className="menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <NavLink link={link} key={link.label} onClick={() => setMenuOpen(false)} />
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
