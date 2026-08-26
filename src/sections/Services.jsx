import { useState } from "react";
import CopyEmailButton from "../components/CopyEmailButton";

const services = [
  {
    title: "Consular Services",
    content:
      "The Embassy provides consular assistance to Sierra Leonean nationals living in or visiting Ethiopia. As Sierra Leone's Permanent Mission to the African Union and the UN Economic Commission for Africa, it also supports government delegations and liaises with AU institutions on the country's behalf, and covers Zambia, Namibia, Malawi, Mozambique, Botswana, Madagascar and South Africa on a non-resident basis.",
    actions: [
      { label: "Copy the Embassy's email", email: "slembassyaddis@gmail.com" },
      { label: "Call +251 11 371 0033", href: "tel:+251113710033" },
    ],
  },
  {
    title: "Visa Services",
    content:
      "Ethiopian nationals and other visitors travelling to Sierra Leone require a visa, which can be arranged in advance through Sierra Leone's official e-Visa and visa-on-arrival facility. Citizens of ECOWAS member states enter Sierra Leone visa-free. The Embassy can guide applicants through the process and verify supporting documents before travel.",
    actions: [
      {
        label: "Apply for an e-Visa",
        href: "https://www.visitsierraleone.org/online-visa/",
        external: true,
      },
    ],
  },
  {
    title: "Passports & Documents",
    content:
      "As a matter of government policy, embassies no longer issue or renew Sierra Leonean passports directly — that is handled solely by the Immigration Department in Freetown through its online portal. The Embassy sells the application voucher and can guide applicants through the process, as well as authenticate and legalise official documents for use abroad.",
    actions: [
      {
        label: "Start your passport application",
        href: "https://passport.slid.datahub.gov.sl/",
        external: true,
      },
    ],
  },
  {
    title: "Citizenship",
    content:
      "Sierra Leone permits dual citizenship, so nationals living abroad are not required to give up another nationality they hold. The Embassy provides guidance on citizenship by birth, descent and registration for members of the diaspora in Ethiopia and the wider region.",
    actions: [
      { label: "Copy the Embassy's email", email: "slembassyaddis@gmail.com" },
    ],
  },
];

function Services() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="services" id="services">
      <p className="section-label">SERVICES</p>

      <h2>How can we help?</h2>

      <div className="services-list">
        {services.map((service, index) => {
          const isOpen = openIndex === index;

          return (
            <div className="service-item" key={service.title}>
              <button
                type="button"
                className="service-header"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>0{index + 1}</span>
                <h3>{service.title}</h3>
                <span className="service-toggle">{isOpen ? "–" : "+"}</span>
              </button>

              <div className={`service-panel ${isOpen ? "open" : ""}`}>
                <div className="service-panel-inner">
                  <p>{service.content}</p>

                  {service.actions && (
                    <div className="service-actions">
                      {service.actions.map((action) =>
                        action.email ? (
                          <CopyEmailButton
                            email={action.email}
                            className="service-action"
                            ariaLabel={action.label}
                            key={action.label}
                          >
                            {action.label}
                            <span aria-hidden="true">→</span>
                          </CopyEmailButton>
                        ) : (
                          <a
                            className="service-action"
                            href={action.href}
                            key={action.label}
                            {...(action.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {action.label}
                            <span aria-hidden="true">→</span>
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services;
