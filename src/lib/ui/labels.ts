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
