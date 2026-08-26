function Contact() {
  return (
    <section className="contact" id="contact">
      <p className="section-label">GET IN TOUCH</p>

      <h2>
        Visit the
        <br />
        <span>Embassy.</span>
      </h2>

      <div className="contact-grid">
        <div className="contact-details">
          <p className="contact-eyebrow">Contact</p>

          <p className="contact-name">Embassy of Sierra Leone,</p>
          <p className="contact-address">Addis Ababa, Ethiopia</p>

          <div className="contact-links">
            <a className="contact-line" href="tel:+251113710033">
              Phone: +251 11 371 0033
            </a>
            <a className="contact-line" href="mailto:salonembadd@yahoo.co.uk">
              Email: salonembadd@yahoo.co.uk
            </a>
          </div>
        </div>

        <div className="contact-hours">
          <p className="contact-eyebrow">Office hours</p>

          <div className="hours-row">
            <span className="hours-day">Monday – Friday</span>
            <span className="hours-time">9:00 – 4:00</span>
          </div>
        </div>

        <div className="contact-map">
          <iframe
            title="Embassy of Sierra Leone location in Addis Ababa"
            src="https://www.google.com/maps?q=Sierra+Leone+Embassy,+Addis+Ababa,+Ethiopia&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export default Contact;
