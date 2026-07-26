"use client";

import { useEffect } from "react";
import { useQuestionResolver } from "@/hooks/use-question-resolver";
import type { Prova, Question } from "@/lib/questions/types";
import {
	alternativeOptionClass,
	feedbackPanelClass,
} from "@/lib/ui/question-styles";
import { renderEmphasis } from "@/lib/ui/render-emphasis";
import { resolveSessionHotkey } from "@/lib/ui/session-hotkeys";

interface QuestionResolverProps {
	prova: Prova;
	question: Question;
	onAnswered: (correct: boolean) => void;
	onNext: (() => void) | null;
	onPrevious: (() => void) | null;
}

const primaryButtonClass =
	"rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50";
const softButtonClass =
	"rounded-lg bg-accent-soft px-5 py-2.5 text-sm font-semibold text-accent-strong hover:bg-accent hover:text-white";
const outlineButtonClass =
	"rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted hover:bg-background";

export function QuestionResolver({
	prova,
	question,
	onAnswered,
	onNext,
	onPrevious,
}: QuestionResolverProps) {
	const { selectedId, setSelectedId, revealed, isCorrect, conferir, resetar } =
		useQuestionResolver(prova, question, onAnswered);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			const action = resolveSessionHotkey({
				key: event.key,
				target: event.target,
				revealed,
			});
			if (!action) {
				return;
			}

			if (action.startsWith("select-")) {
				const optionId = action.slice("select-".length);
				if (question.alternativas.some((option) => option.id === optionId)) {
					event.preventDefault();
					setSelectedId(optionId);
				}
				return;
			}

			if (action === "conferir") {
				if (!selectedId) {
					return;
				}
				event.preventDefault();
				conferir();
				return;
			}

			if (action === "prev" && onPrevious) {
				event.preventDefault();
				onPrevious();
				return;
			}

			if (action === "next" && onNext) {
				event.preventDefault();
				onNext();
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [
		revealed,
		selectedId,
		question.alternativas,
		setSelectedId,
		conferir,
		onNext,
		onPrevious,
	]);

	return (
		<article className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
			<div className="mb-5">
				<span className="inline-flex rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent-strong">
					{question.disciplina}
				</span>
			</div>

			<h2 className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-foreground sm:text-xl">
				{renderEmphasis(question.enunciado)}
			</h2>

			<fieldset className="mt-8 space-y-3" disabled={revealed}>
				<legend className="sr-only">Alternativas</legend>
				{question.alternativas.map((option) => (
					<label
						key={option.id}
						className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${alternativeOptionClass(
							{
								selected: selectedId === option.id,
								revealed,
								isGabarito: option.id === question.gabaritoId,
							},
						)} ${revealed ? "cursor-default" : ""}`}
					>
						<input
							type="radio"
							name={`questao-${question.id}`}
							value={option.id}
							checked={selectedId === option.id}
							onChange={() => setSelectedId(option.id)}
							className="mt-1 accent-[var(--accent)]"
						/>
						<span className="text-sm leading-relaxed sm:text-base">
							<span className="mr-2 font-semibold uppercase text-muted">
								{option.id})
							</span>
							{renderEmphasis(option.texto)}
						</span>
					</label>
				))}
			</fieldset>

			<div className="mt-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
				{!revealed ? (
					<button
						type="button"
						onClick={conferir}
						disabled={!selectedId}
						className={primaryButtonClass}
					>
						Conferir
					</button>
				) : onNext ? (
					<button type="button" onClick={onNext} className={primaryButtonClass}>
						Próxima questão
					</button>
				) : null}

				{!revealed && onNext ? (
					<button type="button" onClick={onNext} className={softButtonClass}>
						Próxima questão
					</button>
				) : null}

				{revealed ? (
					<button
						type="button"
						onClick={resetar}
						className={outlineButtonClass}
					>
						Tentar de novo
					</button>
				) : null}

				{onPrevious ? (
					<button
						type="button"
						onClick={onPrevious}
						className={outlineButtonClass}
					>
						Anterior
					</button>
				) : null}
			</div>

			{revealed ? (
				<div
					className={`mt-8 rounded-xl border px-4 py-4 ${feedbackPanelClass(isCorrect)}`}
					role="status"
				>
					<p className="font-semibold">
						{isCorrect ? "Resposta correta" : "Resposta incorreta"}
					</p>
					<p className="mt-1 text-sm text-foreground/90">
						Sua resposta: <strong className="uppercase">{selectedId}</strong>
						{" · "}
						Gabarito:{" "}
						<strong className="uppercase">{question.gabaritoId}</strong>
					</p>
				</div>
			) : null}
		</article>
	);
}
