const NAV = ["Highlights", "Integrations", "Overview", "Use Cases", "About Us"];
const LEGAL = ["Privacy", "Terms", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-hairline py-16 md:py-24">
      <div className="shell grid gap-12 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-20">
        <div>
          <span className="display text-3xl lowercase tracking-[-0.05em]">matrixpay</span>
          <p className="mt-5 max-w-xs text-sm leading-[1.7] text-muted-foreground">
            White-label payment infrastructure for fintechs, PSPs, ISOs and ambitious merchants.
          </p>
        </div>
        <nav className="flex flex-col gap-3">
          {NAV.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase().replace(" ", "-")}`}
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
              href="#top"
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {n}
            </a>
          ))}
        </nav>
      </div>
      <div className="shell mt-16 flex items-center justify-between border-t border-hairline pt-6 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} MatrixPay</span>
        <span className="size-2 bg-lime" aria-hidden />
      </div>
    </footer>
  );
}
