import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#news", label: "News" },
  { href: "#diplomacy", label: "Diplomacy" },
  { href: "#contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <div className="navbar-logo">
        <div className="flag-mark">
          <span className="green"></span>
          <span className="white"></span>
          <span className="blue"></span>
        </div>

        <div>
          <p className="logo-country">SIERRA LEONE</p>
          <p className="logo-subtitle">Embassy in Ethiopia</p>
        </div>
      </div>

      <div className="navbar-links">
        {links.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
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
          <a
            href={link.href}
            key={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
