"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProvaPlayer } from "@/components/questions/prova-player";
import { QuestionFiltersForm } from "@/components/questions/question-filters";
import type { Prova, Question } from "@/lib/questions/types";

interface ProvaSessionProps {
	prova: Prova;
	questions: Question[];
	disciplinas: string[];
	disciplina?: string;
	initialNumero?: number;
}

export function ProvaSession({
	prova,
	questions,
	disciplinas,
	disciplina,
	initialNumero,
}: ProvaSessionProps) {
	const [focusMode, setFocusMode] = useState(false);
	const [activeQuestionInfo, setActiveQuestionInfo] = useState<{
		numero: number;
		total: number;
	} | null>(null);
	const canFocus = questions.length > 0;

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

	return (
		<div className="space-y-6">
			<div
				className={`flex items-center justify-between gap-3 ${
					focusMode
						? "sticky top-0 z-20 -mx-1 bg-background/95 px-1 py-2 backdrop-blur"
						: ""
				}`}
			>
				{focusMode && activeQuestionInfo ? (
					<p
						className="text-sm font-semibold text-foreground"
						aria-live="polite"
					>
						Questão {activeQuestionInfo.numero} de {activeQuestionInfo.total}
					</p>
				) : (
					<Link
						href="/provas"
						data-hide-on-focus
						className="inline-flex text-sm font-medium text-muted hover:text-accent"
					>
						← Todas as provas
					</Link>
				)}

				{canFocus ? (
					<button
						type="button"
						onClick={() => setFocusMode((current) => !current)}
						aria-pressed={focusMode}
						title={focusMode ? "Sair do foco (Esc)" : "Esconder chrome e mapa"}
						className={
							focusMode
								? "rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-strong"
								: "rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-strong"
						}
					>
						{focusMode ? "Sair do foco" : "Modo foco"}
					</button>
				) : null}
			</div>

			<div data-hide-on-focus className="space-y-6">
				<header className="space-y-2">
					<h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
						{prova.titulo}
					</h1>
					<p className="text-sm text-muted sm:text-base">
						{prova.orgao} · {prova.cargo} · {prova.banca} · {prova.ano}
					</p>
				</header>

				<QuestionFiltersForm
					provaId={prova.id}
					disciplinas={disciplinas}
					current={{ disciplina }}
				/>
			</div>

			{questions.length === 0 ? (
				<div className="rounded-xl border border-dashed border-border bg-surface/70 px-5 py-10 text-center">
					<p className="text-foreground">
						Nenhuma questão encontrada com esse filtro.
					</p>
					<Link
						href={`/provas/${prova.id}`}
						className="mt-4 inline-flex text-sm font-semibold text-accent hover:text-accent-strong"
					>
						Limpar filtro
					</Link>
				</div>
			) : (
				<ProvaPlayer
					key={`${prova.id}-${disciplina ?? "todas"}`}
					prova={prova}
					questions={questions}
					initialNumero={initialNumero}
					focusMode={focusMode}
					onActiveQuestionChange={setActiveQuestionInfo}
				/>
			)}
		</div>
	);
}
