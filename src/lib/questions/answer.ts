import { addAttempt } from "@/lib/history/store"
import type { Prova, Question } from "@/lib/questions/types"

export function isAnswerCorrect(question: Question, selectedOptionId: string): boolean {
  return selectedOptionId === question.gabaritoId
}

export function registerQuestionAttempt(
  prova: Prova,
  question: Question,
  selectedOptionId: string,
): boolean {
  const correct = isAnswerCorrect(question, selectedOptionId)
  addAttempt({
    provaId: prova.id,
    questionId: question.id,
    selectedOptionId,
    correct,
    answeredAt: new Date().toISOString(),
    disciplina: question.disciplina,
    numero: question.numero,
    provaTitulo: prova.titulo,
  })
  return correct
}
