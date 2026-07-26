"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuestionResolver } from "@/components/questions/question-resolver";
import { useProvaPlayer } from "@/hooks/use-prova-player";
import type { Prova, Question } from "@/lib/questions/types";
import { sessionCompactLabel, sessionProgressLabel } from "@/lib/ui/labels";
import {
	type QuestionNavStatus,
	resolveQuestionNavStatus,
} from "@/lib/ui/question-status";
import { questionNavCellClass } from "@/lib/ui/question-styles";
import {
	firstQuestionWithStatus,
	sessionCompletionStats,
	shouldShowCompletion,
} from "@/lib/ui/session-summary";

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
	const [justFinished, setJustFinished] = useState(false);
	const [focusMode, setFocusMode] = useState(false);

	const activeQuestionId = activeQuestion?.id;
	useEffect(() => {
		if (!activeQuestionId || focusMode) {
			return;
		}
		chromeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [activeQuestionId, focusMode]);

	useEffect(() => {
		if (focusMode) {
			document.documentElement.dataset.focusMode = "prova";
		} else {
			delete document.documentElement.dataset.focusMode;
		}
		return () => {
			delete document.documentElement.dataset.focusMode;
		};
	}, [focusMode]);

	useEffect(() => {
		if (!focusMode) {
			return;
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setFocusMode(false);
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [focusMode]);

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

	const stats = sessionCompletionStats(questions, answeredIds, correctIds);
	const allAnswered = stats.pending === 0;
	const showCompletion = shouldShowCompletion({
		hasNext: nextQuestion !== null,
		justFinished,
		allAnswered,
	});
	const currentId = activeQuestion.id;

	const progressPercent =
		questions.length === 0
			? 0
			: Math.round(((stats.correct + stats.wrong) / questions.length) * 100);

	function selectQuestion(questionId: string) {
		setJustFinished(false);
		setActiveId(questionId);
		if (mobileMapRef.current) {
			mobileMapRef.current.open = false;
		}
	}

	function handleAnswered(correct: boolean) {
		markAnswered(currentId, correct);
		if (!nextQuestion) {
			setJustFinished(true);
		}
	}

	const firstWrong = firstQuestionWithStatus(
		questions,
		"wrong",
		answeredIds,
		correctIds,
	);
	const firstPending = firstQuestionWithStatus(
		questions,
		"pending",
		answeredIds,
		correctIds,
	);

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
				className={`flex justify-end ${focusMode ? "sticky top-0 z-20 bg-background/95 py-2 backdrop-blur" : ""}`}
			>
				<button
					type="button"
					onClick={() => setFocusMode((current) => !current)}
					aria-pressed={focusMode}
					title={focusMode ? "Sair do foco (Esc)" : "Esconder chrome e mapa"}
					className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent-strong"
				>
					{focusMode ? "Sair do foco" : "Modo foco"}
				</button>
			</div>

			{!focusMode ? (
				<div
					ref={chromeRef}
					className="sticky top-0 z-10 -mx-1 space-y-2 border-b border-border bg-background/95 px-1 py-3 backdrop-blur"
				>
					<div className="flex flex-wrap items-baseline justify-between gap-2">
						<p className="text-sm font-medium text-foreground">
							Questão {activeQuestion.numero} de {questions.length}
						</p>
						<p className="text-sm text-muted" aria-live="polite">
							{sessionCompactLabel(stats.correct, stats.wrong)}
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
							correct: stats.correct,
							wrong: stats.wrong,
						})}
					</p>
				</div>
			) : null}

			{!focusMode ? (
				<>
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
						<p className="text-sm font-semibold text-foreground">
							Mapa da prova
						</p>
						{renderMapLegend()}
						{renderMapGrid(activeQuestion.id)}
					</nav>
				</>
			) : null}

			<QuestionResolver
				key={activeQuestion.id}
				prova={prova}
				question={activeQuestion}
				onAnswered={handleAnswered}
				onNext={nextQuestion ? () => setActiveId(nextQuestion.id) : null}
				onPrevious={
					previousQuestion ? () => setActiveId(previousQuestion.id) : null
				}
			/>

			{!focusMode && showCompletion ? (
				<section
					className="rounded-2xl border border-accent/30 bg-accent-soft/50 px-5 py-6"
					aria-labelledby="prova-conclusao-titulo"
				>
					<h2
						id="prova-conclusao-titulo"
						className="font-display text-xl font-semibold text-foreground"
					>
						Sessão concluída
					</h2>
					<p className="mt-2 text-sm text-muted">
						{stats.correct} acerto{stats.correct === 1 ? "" : "s"} ·{" "}
						{stats.wrong} erro{stats.wrong === 1 ? "" : "s"} · {stats.pending}{" "}
						pendente{stats.pending === 1 ? "" : "s"} · {stats.taxa}% de
						aproveitamento
					</p>
					<div className="mt-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
						{firstWrong ? (
							<button
								type="button"
								onClick={() => selectQuestion(firstWrong.id)}
								className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong"
							>
								Revisar erros
							</button>
						) : null}
						{firstPending ? (
							<button
								type="button"
								onClick={() => selectQuestion(firstPending.id)}
								className="rounded-lg bg-accent-soft px-5 py-2.5 text-sm font-semibold text-accent-strong hover:bg-accent hover:text-white"
							>
								Continuar pendentes
							</button>
						) : null}
						<Link
							href="/historico"
							className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted hover:bg-background"
						>
							Ver histórico
						</Link>
					</div>
				</section>
			) : null}
		</div>
	);
}
