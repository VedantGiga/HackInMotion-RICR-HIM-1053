const NAV = ["Problem & Vision", "Auto Categorization", "Health Score", "Features", "Live Dashboard"];
const LEGAL = ["Privacy & Security", "NLP Engine Specs", "API Docs"];

export function Footer() {
  return (
    <footer className="border-t border-hairline py-16 md:py-24">
      <div className="shell grid gap-12 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-20">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Koshin logo" className="h-9 w-auto object-contain" />
            <span className="display text-3xl tracking-[-0.05em] text-ink font-bold">koshin</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-[1.7] text-muted-foreground">
            Smart Expense Analyzer & Financial Health Dashboard. "Because you can't fix what you can't see."
          </p>
        </div>
        <nav className="flex flex-col gap-3">
          {NAV.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {n}
            </a>
          ))}
        </nav>
        <nav className="flex flex-col gap-3">
          {LEGAL.map((n) => (
            <a
              key={n}
              href="#demo"
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {n}
            </a>
          ))}
        </nav>
      </div>
      <div className="shell mt-16 flex items-center justify-between border-t border-hairline pt-6 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Koshin</span>
        <span className="size-2 bg-lime" aria-hidden />
      </div>
    </footer>
  );
}

