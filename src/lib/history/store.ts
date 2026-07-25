export interface Attempt {
  provaId: string
  questionId: string
  selectedOptionId: string
  correct: boolean
  answeredAt: string
  disciplina: string
  numero: number
  provaTitulo: string
}

const STORAGE_KEY = "libre-concursos:attempts-v2"

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

export function listAttempts(): Attempt[] {
  if (!canUseStorage()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isAttempt)
  } catch {
    return []
  }
}

export function addAttempt(attempt: Attempt): void {
  if (!canUseStorage()) {
    return
  }

  const current = listAttempts()
  const next = [attempt, ...current]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function clearAttempts(): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export function summarizeAttempts(attempts: Attempt[]): {
  total: number
  acertos: number
  taxa: number
} {
  const total = attempts.length
  const acertos = attempts.filter((attempt) => attempt.correct).length
  const taxa = total === 0 ? 0 : Math.round((acertos / total) * 100)
  return { total, acertos, taxa }
}

function isAttempt(value: unknown): value is Attempt {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.provaId === "string" &&
    typeof record.questionId === "string" &&
    typeof record.selectedOptionId === "string" &&
    typeof record.correct === "boolean" &&
    typeof record.answeredAt === "string" &&
    typeof record.disciplina === "string" &&
    typeof record.numero === "number" &&
    typeof record.provaTitulo === "string"
  )
}
