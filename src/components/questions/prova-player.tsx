"use client";

import { useEffect, useRef } from "react";
import { QuestionResolver } from "@/components/questions/question-resolver";
import { useProvaPlayer } from "@/hooks/use-prova-player";
import type { Prova, Question } from "@/lib/questions/types";
import { sessionCompactLabel, sessionProgressLabel } from "@/lib/ui/labels";
import {
	type QuestionNavStatus,
	resolveQuestionNavStatus,
} from "@/lib/ui/question-status";
import { questionNavCellClass } from "@/lib/ui/question-styles";

interface ProvaPlayerProps {
	prova: Prova;
	questions: Question[];
	initialNumero?: number;
}

export function ProvaPlayer({
	prova,
	questions,
	initialNumero,
}: ProvaPlayerProps) {
	const {
		activeQuestion,
		nextQuestion,
		previousQuestion,
		correctIds,
		answeredIds,
		setActiveId,
		markAnswered,
	} = useProvaPlayer(prova, questions, initialNumero);
	const chromeRef = useRef<HTMLDivElement>(null);
	const mobileMapRef = useRef<HTMLDetailsElement>(null);

	const activeQuestionId = activeQuestion?.id;
	useEffect(() => {
		if (!activeQuestionId) {
			return;
		}
		chromeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [activeQuestionId]);

	if (questions.length === 0) {
		return null;
	}

	if (!activeQuestion) {
		return (
			<p className="text-sm text-muted" aria-live="polite">
				Carregando progresso...
			</p>
		);
	}

	const correctCount = [...correctIds].filter((id) =>
		questions.some((question) => question.id === id),
	).length;
	const answeredInList = [...answeredIds].filter((id) =>
		questions.some((question) => question.id === id),
	).length;
	const wrongCount = answeredInList - correctCount;
	const progressPercent =
		questions.length === 0
			? 0
			: Math.round((answeredInList / questions.length) * 100);

	function selectQuestion(questionId: string) {
		setActiveId(questionId);
		if (mobileMapRef.current) {
			mobileMapRef.current.open = false;
		}
	}

	function renderMapLegend() {
		return (
			<ul className="flex flex-wrap gap-3 text-xs text-muted">
				<li className="flex items-center gap-1.5">
					<span
						className="inline-block size-2.5 rounded-sm border border-border bg-surface"
						aria-hidden
					/>
					Pendente
				</li>
				<li className="flex items-center gap-1.5">
					<span
						className="inline-block size-2.5 rounded-sm bg-danger"
						aria-hidden
					/>
					Erro
				</li>
				<li className="flex items-center gap-1.5">
					<span
						className="inline-block size-2.5 rounded-sm bg-success"
						aria-hidden
					/>
					Acerto
				</li>
				<li className="flex items-center gap-1.5">
					<span
						className="inline-block size-2.5 rounded-sm bg-accent ring-2 ring-accent/40"
						aria-hidden
					/>
					Atual
				</li>
			</ul>
		);
	}

	function renderMapGrid(activeId: string) {
		return (
			<ul className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
				{questions.map((question) => {
					const isActive = question.id === activeId;
					const status: QuestionNavStatus = resolveQuestionNavStatus(
						question.id,
						answeredIds,
						correctIds,
					);
					return (
						<li key={question.id}>
							<button
								type="button"
								onClick={() => selectQuestion(question.id)}
								aria-current={isActive ? "true" : undefined}
								className={`flex min-h-11 w-full items-center justify-center rounded-md border text-sm font-semibold ${questionNavCellClass(status, isActive)}`}
							>
								{question.numero}
							</button>
						</li>
					);
				})}
			</ul>
		);
	}

	return (
		<div className="space-y-6">
			<div
				ref={chromeRef}
				data-prova-chrome
				className="sticky top-0 z-10 -mx-1 space-y-2 border-b border-border bg-background/95 px-1 py-3 backdrop-blur"
			>
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<p className="text-sm font-medium text-foreground">
						Questão {activeQuestion.numero} de {questions.length}
					</p>
					<p className="text-sm text-muted" aria-live="polite">
						{sessionCompactLabel(correctCount, wrongCount)}
					</p>
				</div>
				<div
					className="h-1.5 overflow-hidden rounded-full bg-border"
					role="progressbar"
					aria-valuenow={progressPercent}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label="Progresso da sessão"
				>
					<div
						className="h-full rounded-full bg-accent transition-[width] duration-300"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
				<p className="text-xs text-muted" aria-live="polite">
					{sessionProgressLabel({
						total: questions.length,
						correct: correctCount,
						wrong: wrongCount,
					})}
				</p>
			</div>

			<QuestionResolver
				key={activeQuestion.id}
				prova={prova}
				question={activeQuestion}
				onAnswered={(correct) => markAnswered(activeQuestion.id, correct)}
				onNext={nextQuestion ? () => setActiveId(nextQuestion.id) : null}
				onPrevious={
					previousQuestion ? () => setActiveId(previousQuestion.id) : null
				}
			/>

			<details ref={mobileMapRef} className="group lg:hidden">
				<summary className="cursor-pointer list-none rounded-lg border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
					<span className="flex items-center justify-between gap-2">
						Mapa da prova
						<span className="text-muted group-open:hidden">▾</span>
						<span className="hidden text-muted group-open:inline">▴</span>
					</span>
				</summary>
				<nav aria-label="Navegação das questões" className="mt-3 space-y-3">
					{renderMapLegend()}
					{renderMapGrid(activeQuestion.id)}
				</nav>
			</details>

			<nav
				aria-label="Navegação das questões"
				className="hidden space-y-3 lg:block"
			>
				<p className="text-sm font-semibold text-foreground">Mapa da prova</p>
				{renderMapLegend()}
				{renderMapGrid(activeQuestion.id)}
			</nav>
		</div>
	);
}
