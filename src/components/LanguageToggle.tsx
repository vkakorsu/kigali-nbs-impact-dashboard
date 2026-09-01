import { useEffect, useState } from "react";

type Lang = "en" | "rw";

interface Props {
  className?: string;
}

/**
 * Instant English | Kinyarwanda toggle. Both languages ship in the static
 * HTML and CSS shows one at a time, so switching costs zero network
 * requests. The choice persists in localStorage and other islands (map,
 * charts, a second toggle in the mobile menu) listen for `langchange`.
 */
export default function LanguageToggle({ className = "" }: Props) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "rw" || stored === "en") setLang(stored);
    const onChange = (event: Event) => {
      const next = (event as CustomEvent).detail as Lang;
      if (next === "rw" || next === "en") setLang(next);
    };
    window.addEventListener("langchange", onChange);
    return () => window.removeEventListener("langchange", onChange);
  }, []);

  function choose(next: Lang) {
    setLang(next);
    window.localStorage.setItem("lang", next);
    document.documentElement.dataset.lang = next;
    window.dispatchEvent(new CustomEvent("langchange", { detail: next }));
  }

  const base =
    "px-2.5 sm:px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-colors whitespace-nowrap";
  const active = "bg-highland text-paper shadow-sm";
  const idle = "text-ink/70 hover:text-highland";

  return (
    <div
      className={`flex items-center rounded-full border border-ink/15 bg-mist/70 p-0.5 ${className}`.trim()}
      role="group"
      aria-label="Language selection / Guhitamo ururimi"
    >
      <button
        type="button"
        className={`${base} ${lang === "en" ? active : idle}`}
        aria-pressed={lang === "en"}
        lang="en"
        onClick={() => choose("en")}
      >
        English
      </button>
      <button
        type="button"
        className={`${base} ${lang === "rw" ? active : idle}`}
        aria-pressed={lang === "rw"}
        lang="rw"
        onClick={() => choose("rw")}
      >
        Kinyarwanda
      </button>
    </div>
  );
}
