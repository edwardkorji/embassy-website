import { Link } from "react-router-dom";

function Privacy() {
  return (
    <main>
      <article className="blog-post">
        <header className="blog-post-header">
          <Link className="blog-post-back" to="/">
            ← Back to home
          </Link>

          <h1>Privacy Policy</h1>

          <div className="blog-post-meta">
            <span>Last updated 8 September 2026</span>
          </div>
        </header>

        <div className="blog-post-body">
          <p>
            This page explains what happens to your data when you visit the
            website of the Embassy of Sierra Leone in Ethiopia.
          </p>

          <p>
            <strong>We don't use analytics or tracking.</strong> This site has
            no visitor analytics, advertising pixels, or tracking scripts of
            any kind, and doesn't set any tracking cookies. There's also no
            newsletter signup or contact form collecting your personal
            details anywhere on the public site.
          </p>

          <p>
            <strong>Staff login.</strong> A small part of this site is a
            private dashboard used by embassy staff to publish content. If
            you're not embassy staff, this doesn't apply to you. Signing in
            there collects only an email address and password, used solely to
            authenticate authorized personnel via Firebase Authentication,
            which stores a session token in your browser's local storage.
            That's the only use of browser storage on this site.
          </p>

          <p>
            <strong>Embedded third-party content.</strong> A few pages embed
            content hosted by Google, which may set their own cookies or see
            your IP address when that content loads, under Google's own
            privacy practices:
          </p>

          <p>
            — Google Maps, to show the Embassy's location on the Contact
            section.
            <br />
            — Google Fonts, for the typefaces used across the site.
            <br />— Google Docs Viewer, to preview PDF reports on the
            Publications page.
          </p>

          <p>
            <strong>Outbound links.</strong> This site links out to our
            social media pages and to Sierra Leonean government services
            (e.g. passport applications). Those sites have their own privacy
            policies, which we don't control.
          </p>

          <p>
            Questions about this policy can be sent to{" "}
            <a href="mailto:slembassyaddis@gmail.com">
              slembassyaddis@gmail.com
            </a>
            .
          </p>
        </div>
      </article>
    </main>
  );
}

export default Privacy;
