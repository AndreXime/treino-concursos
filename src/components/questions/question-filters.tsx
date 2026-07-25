"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { buildProvaHref } from "@/lib/provas/url"

interface QuestionFiltersFormProps {
  provaId: string
  disciplinas: string[]
  current: {
    disciplina?: string
  }
}

export function QuestionFiltersForm({
  provaId,
  disciplinas,
  current,
}: QuestionFiltersFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function navigate(disciplina: string) {
    startTransition(() => {
      router.push(buildProvaHref(provaId, disciplina || undefined))
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm lg:flex-row lg:items-end">
      <label className="flex flex-1 flex-col gap-1 text-sm">
        <span className="font-medium text-muted">Disciplina</span>
        <select
          key={current.disciplina ?? "todas"}
          name="disciplina"
          defaultValue={current.disciplina ?? ""}
          disabled={isPending}
          onChange={(event) => navigate(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
        >
          <option value="">Todas</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina} value={disciplina}>
              {disciplina}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        disabled={isPending || !current.disciplina}
        onClick={() => navigate("")}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-background disabled:opacity-50"
      >
        Limpar
      </button>
    </div>
  )
}
