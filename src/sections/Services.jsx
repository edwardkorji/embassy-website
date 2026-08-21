function Services() {
  const services = [
    "Consular Services",
    "Visa Services",
    "Passports & Documents",
    "Citizenship",
  ];

  return (
    <section className="services" id="services">
      <p className="section-label">SERVICES</p>

      <h2>How can we help?</h2>

      <div className="services-list">
        {services.map((service, index) => (
          <div className="service-item" key={service}>
            <span>0{index + 1}</span>
            <h3>{service}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Services;
