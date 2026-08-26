const highlights = [
  {
    tag: "2014",
    title: "Accredited to the African Union",
    text: "Ambassador Osman Keh Kamara was accredited as Sierra Leone's Permanent Representative to the African Union, formalising the Embassy's dual role as the country's Permanent Mission to both the AU and the UN Economic Commission for Africa — institutions headquartered in Addis Ababa — alongside its non-resident accreditation to Zambia, Namibia, Malawi, Mozambique, Botswana, Madagascar and South Africa.",
    floatLabel: "AU Accreditation",
  },
  {
    tag: "2019",
    title: "Memorandum of Understanding signed",
    text: "Ethiopia's Deputy Prime Minister Demeke Mekonnen led a delegation to Freetown and met President Julius Maada Bio, resulting in an MoU covering mining, education, health, tourism, aviation and real estate.",
    floatLabel: "MoU Signed",
  },
  {
    tag: "2026",
    title: "Direct flights between Addis Ababa and Freetown",
    text: "Ethiopia's parliament ratified a bilateral air service agreement granting Ethiopian Airlines direct flight rights to Sierra Leone, replacing the previous routing through Ouagadougou, Burkina Faso.",
    floatLabel: "Direct Flights",
  },
  {
    tag: "6",
    floatLabel: "Sectors of Cooperation",
  },
];

const areas = [
  "Mining",
  "Education",
  "Health",
  "Tourism",
  "Aviation",
  "Real Estate",
];

function Diplomacy() {
  const timeline = highlights.filter((item) => item.title);

  return (
    <section className="diplomacy" id="diplomacy">
      <div className="diplomacy-hero">
        <p className="section-label">SIERRA LEONE × ETHIOPIA</p>

        <h2>
          Building bridges
          <br />
          <span>between nations.</span>
        </h2>

        <p className="diplomacy-intro">
          The Embassy in Addis Ababa also serves as Sierra Leone's Permanent
          Mission to the African Union and the UN Economic Commission for
          Africa, both headquartered in Ethiopia. From here, the two
          countries have built a practical partnership across trade, health,
          education and travel.
        </p>

        <div className="diplomacy-floaters" aria-hidden="true">
          {highlights.map((item) => (
            <div className="diplomacy-floater" key={item.tag}>
              <span className="diplomacy-floater-value">{item.tag}</span>
              <span className="diplomacy-floater-label">
                {item.floatLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="diplomacy-timeline">
        {timeline.map((item) => (
          <div className="diplomacy-event" key={item.tag}>
            <span className="diplomacy-year">{item.tag}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="diplomacy-areas">
        <p className="diplomacy-areas-label">
          Areas of cooperation named in the 2019 MoU
        </p>
        <ul>
          {areas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Diplomacy;
