import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { LayoutDashboard, Newspaper, FileText, Users, LogOut, Menu, X } from "lucide-react";
import { auth } from "../lib/firebase";
import "../dashboard.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/blog", label: "Blog posts", icon: Newspaper },
  { to: "/dashboard/publications", label: "Publications", icon: FileText },
  { to: "/dashboard/team", label: "Team", icon: Users },
];

const PAGE_TITLES = {
  "/dashboard": "Overview",
  "/dashboard/blog": "Blog posts",
  "/dashboard/publications": "Publications",
  "/dashboard/team": "Team",
};

function NavList({ onNavigate }) {
  return (
    <nav className="dash-nav">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) => `dash-nav-link${isActive ? " active" : ""}`}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const title = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((path) => location.pathname.startsWith(path));

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-logo">
          <div className="flag-mark" aria-hidden="true">
            <span className="green"></span>
            <span className="white"></span>
            <span className="blue"></span>
          </div>
          <div className="dashboard-sidebar-logo-text">
            Embassy Dashboard
            <span>Sierra Leone in Ethiopia</span>
          </div>
        </div>

        <NavList />

        <button type="button" className="dashboard-logout" onClick={handleLogout}>
          <LogOut size={18} /> Log out
        </button>
      </aside>

      <div className="dashboard-topbar">
        <button
          type="button"
          className="dashboard-menu-button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <span className="dashboard-topbar-title">{PAGE_TITLES[title] || "Dashboard"}</span>
        <div style={{ width: 44 }} />
      </div>

      {drawerOpen && (
        <>
          <div className="dashboard-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="dashboard-drawer">
            <button
              type="button"
              className="dashboard-drawer-close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <NavList onNavigate={() => setDrawerOpen(false)} />
            <button type="button" className="dashboard-logout" onClick={handleLogout}>
              <LogOut size={18} /> Log out
            </button>
          </div>
        </>
      )}

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
