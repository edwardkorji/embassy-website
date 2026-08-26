import CopyEmailButton from "./CopyEmailButton";

// Shared Facebook / X / email row — used on the Hero and in Contact.
function SocialLinks({ wrapClassName, itemClassName }) {
  return (
    <div className={wrapClassName}>
      <a
        href="https://web.facebook.com/profile.php?id=61593937314847"
        target="_blank"
        rel="noopener noreferrer"
        className={itemClassName}
        aria-label="Follow us on Facebook"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.98H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.89h-2.4v6.98A10 10 0 0 0 22 12z" />
        </svg>
      </a>

      <a
        href="https://x.com/SLembassyAddis"
        target="_blank"
        rel="noopener noreferrer"
        className={itemClassName}
        aria-label="Follow us on X"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 3H21l-6.6 7.54L22.2 21h-6.1l-4.8-6.3L5.7 21H3.6l7.05-8.06L2.4 3h6.25l4.35 5.75L18.9 3zm-1.07 16.17h1.17L7.24 4.76H6l11.83 14.41z" />
        </svg>
      </a>

      <CopyEmailButton
        email="slembassyaddis@gmail.com"
        className={itemClassName}
        ariaLabel="Copy the Embassy's email address"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.01L12 13l8-6.99V6H4zm16 12V8.24l-7.4 6.47a1 1 0 0 1-1.2 0L4 8.24V18h16z" />
        </svg>
      </CopyEmailButton>
    </div>
  );
}

export default SocialLinks;
