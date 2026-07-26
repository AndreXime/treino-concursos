import { type Attempt, summarizeAttempts } from "@/lib/history/store";

export function attemptSummaryLabel(attempts: Attempt[]): string {
	const { total, acertos, taxa } = summarizeAttempts(attempts);
	return `${total} tentativa${total === 1 ? "" : "s"} · ${acertos} acerto${acertos === 1 ? "" : "s"} · ${taxa}% de aproveitamento`;
}

export function answeredCountLabel(total: number, answered: number): string {
	const base = `${total} questão${total === 1 ? "" : "ões"}`;
	if (answered === 0) {
		return base;
	}
	return `${base} · ${answered} respondida${answered === 1 ? "" : "s"}`;
}

export function sessionProgressLabel(input: {
	total: number;
	correct: number;
	wrong: number;
}): string {
	const answered = input.correct + input.wrong;
	const acerto = input.correct === 1 ? "acerto" : "acertos";
	const erro = input.wrong === 1 ? "erro" : "erros";
	return `${answered}/${input.total} · ${input.correct} ${acerto} · ${input.wrong} ${erro}`;
}

export function sessionCompactLabel(correct: number, wrong: number): string {
	return `${correct}✓ ${wrong}✗`;
}
