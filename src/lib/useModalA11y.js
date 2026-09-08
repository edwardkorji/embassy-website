import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Closes on Escape, moves focus into the container on open, and traps
 * Tab/Shift+Tab within it while active — shared by every overlay/modal
 * (ConfirmDialog, the dashboard's mobile drawer, the publications viewer).
 */
export function useModalA11y(containerRef, { active = true, onClose } = {}) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement;

    const focusables = () =>
      Array.from(container?.querySelectorAll(FOCUSABLE_SELECTOR) || []);

    const first = focusables()[0];
    (first || container)?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }

      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [active, containerRef, onClose]);
}
