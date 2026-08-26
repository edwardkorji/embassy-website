const team = [
  {
    name: "Alhaji M. Kamara",
    role: "Ambassador",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fatmata S. Koroma",
    role: "Deputy Head of Mission",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ibrahim T. Sesay",
    role: "Consular Officer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Adama N. Bangura",
    role: "Political & Economic Affairs",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mohamed L. Conteh",
    role: "Trade & Investment Attaché",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Isata R. Turay",
    role: "Administrative Officer",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
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

            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Team;
