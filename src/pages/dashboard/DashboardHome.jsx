import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getCountFromServer } from "firebase/firestore";
import { Newspaper, FileText, Users } from "lucide-react";
import { db } from "../../lib/firebase";

const CARDS = [
  { key: "blogs", label: "Blog posts", to: "/dashboard/blog", icon: Newspaper },
  { key: "publications", label: "Publications", to: "/dashboard/publications", icon: FileText },
  { key: "team", label: "Team members", to: "/dashboard/team", icon: Users },
];

function DashboardHome() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      CARDS.map(async ({ key }) => {
        const snap = await getCountFromServer(collection(db, key));
        return [key, snap.data().count];
      })
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1>Welcome back</h1>
          <p>Manage what's live on the embassy website.</p>
        </div>
      </div>

      <div className="dash-grid">
        {CARDS.map(({ key, label, to, icon: Icon }) => (
          <Link className="dash-stat" to={to} key={key} style={{ display: "block" }}>
            <Icon size={22} color="var(--grey)" />
            <div className="dash-stat-value">
              {counts[key] === undefined ? "…" : counts[key]}
            </div>
            <div className="dash-stat-label">{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardHome;
