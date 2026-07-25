"use client"

import { useEffect, useState } from "react"
import {
  findNextQuestion,
  findQuestionById,
  loadAnsweredIds,
  loadCorrectIds,
  resolveInitialQuestionId,
  withAddedId,
} from "@/lib/history/progress"
import type { Prova, Question } from "@/lib/questions/types"

export function useProvaPlayer(
  prova: Prova,
  questions: Question[],
  initialNumero?: number,
) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [correctIds, setCorrectIds] = useState<Set<string>>(() => new Set())
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setCorrectIds(loadCorrectIds(prova.id))
    setAnsweredIds(loadAnsweredIds(prova.id))
    setActiveId(resolveInitialQuestionId(questions, prova.id, initialNumero))
  }, [prova.id, questions, initialNumero])

  const activeQuestion = findQuestionById(questions, activeId)
  const nextQuestion = activeQuestion
    ? findNextQuestion(questions, activeQuestion.id)
    : null

  function markAnswered(questionId: string, correct: boolean) {
    setAnsweredIds((current) => withAddedId(current, questionId))
    if (correct) {
      setCorrectIds((current) => withAddedId(current, questionId))
    }
  }

  return {
    activeQuestion,
    nextQuestion,
    correctIds,
    answeredIds,
    setActiveId,
    markAnswered,
  }
}
