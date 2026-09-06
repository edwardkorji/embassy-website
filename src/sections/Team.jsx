import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

function Team() {
  // Firebase not configured (see .env.example) — nothing to load, so start
  // in the "empty" state directly instead of setting it from inside the
  // effect below.
  const [team, setTeam] = useState(db ? null : []);

  useEffect(() => {
    if (!db) return;

    const teamQuery = query(collection(db, "team"), orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      teamQuery,
      (snapshot) => {
        setTeam(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => {
        console.error("Failed to load team:", err);
        setTeam([]);
      }
    );

    return unsubscribe;
  }, []);

  if (!team || team.length === 0) return null;

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
          <div className="team-card" key={member.id}>
            <div className="team-photo-wrap">
              <div className="team-photo">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                />
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
                href={member.linkedin || "#"}
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
          </div>
        ))}
      </div>
    </section>
  );
}

export default Team;
