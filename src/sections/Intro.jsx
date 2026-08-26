const facts = [
  { label: "Capital", value: "Freetown" },
  { label: "Population", value: "~8.6 million" },
  { label: "Official Language", value: "English" },
  { label: "Independence", value: "27 April 1961" },
  { label: "Currency", value: "Leone (SLE)" },
];

function Intro() {
  return (
    <section className="intro" id="about">
      <p className="section-label">SIERRA LEONE</p>

      <h2>
        A nation of
        <span> resilience, unity </span>
        and possibility.
      </h2>

      <p className="intro-text">
        The Embassy of Sierra Leone in Ethiopia represents the interests of
        Sierra Leone and works to strengthen the relationship between our two
        nations.
      </p>

      <div className="intro-facts">
        {facts.map((fact) => (
          <div className="intro-fact" key={fact.label}>
            <p className="intro-fact-label">{fact.label}</p>
            <p className="intro-fact-value">{fact.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Intro;
