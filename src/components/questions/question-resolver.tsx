"use client";

import { useQuestionResolver } from "@/hooks/use-question-resolver";
import type { Prova, Question } from "@/lib/questions/types";
import { renderEmphasis } from "@/lib/ui/render-emphasis";
import {
	alternativeOptionClass,
	feedbackPanelClass,
} from "@/lib/ui/question-styles";

interface QuestionResolverProps {
	prova: Prova;
	question: Question;
	onAnswered: (correct: boolean) => void;
	onNext: (() => void) | null;
}

export function QuestionResolver({
	prova,
	question,
	onAnswered,
	onNext,
}: QuestionResolverProps) {
	const { selectedId, setSelectedId, revealed, isCorrect, conferir, resetar } =
		useQuestionResolver(prova, question, onAnswered);

	return (
		<article className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
			<div className="mb-5 flex flex-wrap gap-2 text-xs font-medium text-muted">
				<span className="rounded-md bg-background px-2 py-1">
					Questão {question.numero}
				</span>
				<span className="rounded-md bg-accent-soft px-2 py-1 text-accent-strong">
					{question.disciplina}
				</span>
				<span className="rounded-md bg-background px-2 py-1">
					{prova.banca}
				</span>
				<span className="rounded-md bg-background px-2 py-1">{prova.ano}</span>
			</div>

			<h1 className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground sm:text-lg">
				{renderEmphasis(question.enunciado)}
			</h1>

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

			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				{!revealed ? (
					<button
						type="button"
						onClick={conferir}
						disabled={!selectedId}
						className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
					>
						Conferir
					</button>
				) : (
					<button
						type="button"
						onClick={resetar}
						className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted hover:bg-background"
					>
						Tentar de novo
					</button>
				)}

				{onNext ? (
					<button
						type="button"
						onClick={onNext}
						className="rounded-lg bg-accent-soft px-5 py-2.5 text-sm font-semibold text-accent-strong hover:bg-accent hover:text-white"
					>
						Próxima questão
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
						Gabarito:{" "}
						<strong className="uppercase">{question.gabaritoId}</strong>
					</p>
				</div>
			) : null}
		</article>
	);
}
