"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type Attempt, clearAttempts, listAttempts } from "@/lib/history/store";
import { attemptSummaryLabel } from "@/lib/ui/labels";

export function HistoryList() {
	const [attempts, setAttempts] = useState<Attempt[]>([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setAttempts(listAttempts());
		setReady(true);
	}, []);

	if (!ready) {
		return (
			<p className="text-sm text-muted" aria-live="polite">
				Carregando histórico...
			</p>
		);
	}

	if (attempts.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-border bg-surface/70 px-5 py-10 text-center">
				<p className="text-foreground">Nenhuma tentativa ainda.</p>
				<p className="mt-2 text-sm text-muted">
					Resolva questões de uma prova para ver seu histórico local aqui.
				</p>
				<Link
					href="/"
					className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
				>
					Ver provas
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-muted">{attemptSummaryLabel(attempts)}</p>
				<button
					type="button"
					onClick={() => {
						clearAttempts();
						setAttempts([]);
					}}
					className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted hover:bg-surface"
				>
					Limpar histórico
				</button>
			</div>

			<ul className="space-y-3">
				{attempts.map((attempt) => (
					<li
						key={`${attempt.questionId}-${attempt.answeredAt}`}
						className="rounded-xl border border-border bg-surface p-4 shadow-sm"
					>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<p className="text-sm font-medium text-foreground">
									Questão {attempt.numero}
								</p>
								<p className="mt-1 text-xs text-muted">{attempt.provaTitulo}</p>
								<p className="mt-1 text-xs text-muted">{attempt.disciplina}</p>
								<p className="mt-2 text-xs text-muted">
									{new Date(attempt.answeredAt).toLocaleString("pt-BR")}
								</p>
							</div>
							<span
								className={`inline-flex w-fit rounded-md px-2 py-1 text-xs font-semibold ${
									attempt.correct
										? "bg-success-soft text-success"
										: "bg-danger-soft text-danger"
								}`}
							>
								{attempt.correct ? "Acerto" : "Erro"}
							</span>
						</div>
						<Link
							href={`/provas/${attempt.provaId}?q=${attempt.numero}`}
							className="mt-3 inline-flex text-sm font-semibold text-accent hover:text-accent-strong"
						>
							Abrir questão
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
