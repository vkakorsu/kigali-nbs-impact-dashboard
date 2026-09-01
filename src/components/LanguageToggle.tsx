import { useEffect, useState } from "react";

type Lang = "en" | "rw";

/**
 * Instant EN | RW toggle. Both languages ship in the static HTML and CSS
 * shows one at a time, so switching costs zero network requests. The choice
 * persists in localStorage and other islands (map, charts) listen for the
 * `langchange` event to update their own labels.
 */
export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "rw" || stored === "en") setLang(stored);
  }, []);

  function choose(next: Lang) {
    setLang(next);
    window.localStorage.setItem("lang", next);
    document.documentElement.dataset.lang = next;
    window.dispatchEvent(new CustomEvent("langchange", { detail: next }));
  }

  const base =
    "px-3 py-1 text-xs font-semibold tracking-wide rounded-full transition-colors";
  const active = "bg-highland text-paper shadow-sm";
  const idle = "text-ink/70 hover:text-highland";

  return (
    <div
      className="flex items-center rounded-full border border-ink/15 bg-mist/70 p-0.5"
      role="group"
      aria-label="Language selection / Guhitamo ururimi"
    >
      <button
        type="button"
        className={`${base} ${lang === "en" ? active : idle}`}
        aria-pressed={lang === "en"}
        onClick={() => choose("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`${base} ${lang === "rw" ? active : idle}`}
        aria-pressed={lang === "rw"}
        onClick={() => choose("rw")}
      >
        RW
      </button>
    </div>
  );
}
