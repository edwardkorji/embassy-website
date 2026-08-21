import { ArrowDown } from "lucide-react";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="hero-label">EMBASSY OF THE REPUBLIC OF SIERRA LEONE</p>

        <h1>
          Sierra Leone
          <br />
          <span>in Ethiopia.</span>
        </h1>

        <p className="hero-description">
          Strengthening diplomatic relations, fostering cooperation, and
          connecting the people of Sierra Leone and Ethiopia.
        </p>

        <a href="#about" className="hero-button">
          Disvover the Embassy
          <ArrowDown size={18} />
        </a>
      </div>

      <div className="hero-location">
        <span>ADDIS ABABA</span>
        <span>ETHIOPIA</span>
      </div>
    </section>
  );
}

export default Hero;
