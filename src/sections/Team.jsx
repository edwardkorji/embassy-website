import { Link } from "react-router-dom";

const team = [
  {
    name: "Alhaji M. Kamara",
    role: "Ambassador",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    linkedin: "#",
    hasPublications: true,
  },
  {
    name: "Fatmata S. Koroma",
    role: "Deputy Head of Mission",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=800&q=80",
    linkedin: "#",
    hasPublications: true,
  },
  {
    name: "Ibrahim T. Sesay",
    role: "Consular Officer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    linkedin: "#",
  },
  {
    name: "Adama N. Bangura",
    role: "Political & Economic Affairs",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
    linkedin: "#",
  },
  {
    name: "Mohamed L. Conteh",
    role: "Trade & Investment Attaché",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    linkedin: "#",
    hasPublications: true,
  },
  {
    name: "Isata R. Turay",
    role: "Administrative Officer",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    linkedin: "#",
  },
];

function Team() {
  return (
    <section className="team" id="team">
      <p className="section-label">OUR TEAM</p>

      <h2>
        Meet the people
        <br />
        <span>behind the mission.</span>
      </h2>

      <div className="team-grid">
        {team.map((member) => (
          <div className="team-card" key={member.name}>
            <div className="team-photo-wrap">
              <div className="team-photo">
                <img src={member.image} alt={member.name} loading="lazy" />
              </div>

              <span className="team-flag" aria-hidden="true">
                <span className="team-flag-stripe team-flag-stripe--green" />
                <span className="team-flag-stripe team-flag-stripe--white" />
                <span className="team-flag-stripe team-flag-stripe--blue" />
              </span>
            </div>

            <div className="team-card-header">
              <div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>

              <a
                className="team-linkedin"
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56z" />
                </svg>
              </a>
            </div>

            {member.hasPublications && (
              <Link
                className="team-publications-link nav-glow"
                to={`/publications?author=${encodeURIComponent(member.name)}`}
              >
                View Publications
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Team;
