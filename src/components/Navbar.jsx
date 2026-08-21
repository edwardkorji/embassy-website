import { Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
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
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#news">News</a>
        <a href="#diplomacy">Diplomacy</a>
        <a href="#contact">Contact</a>
      </div>

      <button className="menu-button">
        <Menu size={24} />
      </button>
    </nav>
  );
}

export default Navbar;
