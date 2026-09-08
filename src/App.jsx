import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginFab from "./components/LoginFab";
import { AuthProvider, ProtectedRoute } from "./lib/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const Publications = lazy(() => import("./pages/Publications"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Login = lazy(() => import("./pages/Login"));
const Privacy = lazy(() => import("./pages/Privacy"));
const DashboardLayout = lazy(() => import("./components/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const DashboardBlog = lazy(() => import("./pages/dashboard/DashboardBlog"));
const DashboardPublications = lazy(() => import("./pages/dashboard/DashboardPublications"));
const DashboardTeam = lazy(() => import("./pages/dashboard/DashboardTeam"));

function DashboardSpinner() {
  return (
    <div className="dashboard-splash">
      <div className="dashboard-spinner" aria-label="Loading" />
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  // Login/dashboard get their own chrome (no public navbar, a spinner
  // fallback instead of a blank flash while their extra chunks load).
  const isAppRoute = location.pathname === "/login" || location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isAppRoute && <Navbar />}
      {!isAppRoute && <LoginFab />}

      <Suspense fallback={isAppRoute ? <DashboardSpinner /> : null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="blog" element={<DashboardBlog />} />
            <Route path="publications" element={<DashboardPublications />} />
            <Route path="team" element={<DashboardTeam />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
