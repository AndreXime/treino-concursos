import Link from "next/link"

export default function ProvaNotFound() {
  return (
    <div className="rounded-xl border border-border bg-surface px-5 py-10 text-center shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Prova não encontrada
      </h1>
      <p className="mt-2 text-sm text-muted">
        O identificador informado não corresponde a nenhuma prova cadastrada.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
      >
        Ver provas
      </Link>
    </div>
  )
}
