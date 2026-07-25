import Link from "next/link"

const links = [{ href: "/historico", label: "Histórico" }] as const

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-surface">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex flex-col">
          <span className="font-display text-xl font-semibold tracking-tight text-foreground group-hover:text-accent-strong sm:text-2xl">
            LibreConcursos
          </span>
          <span className="text-xs text-muted">Questões de concurso, livres</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-accent-soft hover:text-accent-strong"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
