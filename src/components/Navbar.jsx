import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#team", label: "Team" },
  { href: "/#news", label: "News" },
  { href: "/#diplomacy", label: "Diplomacy" },
  { href: "/#contact", label: "Contact" },
  { to: "/publications", label: "Publications", glow: true },
];

function NavLink({ link, onClick }) {
  const className = link.glow ? "nav-glow" : undefined;

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

  return (
    <nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
        menuOpen ? "navbar-menu-open" : ""
      }`}
    >
      <Link
        to="/"
        className="navbar-logo"
        onClick={() => setMenuOpen(false)}
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
