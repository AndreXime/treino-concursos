import type { QuestionNavStatus } from "@/lib/ui/question-status";

export function questionNavCellClass(
	status: QuestionNavStatus,
	isActive: boolean,
): string {
	if (status === "correct") {
		return isActive
			? "border-success bg-success text-white ring-2 ring-success/40"
			: "border-success bg-success text-white hover:border-success hover:bg-success";
	}
	if (status === "wrong") {
		return isActive
			? "border-danger bg-danger text-white ring-2 ring-danger/40"
			: "border-danger bg-danger text-white hover:border-danger hover:bg-danger";
	}
	if (isActive) {
		return "border-accent bg-accent text-white ring-2 ring-accent/30";
	}
	return "border-border bg-surface text-muted hover:border-accent/40 hover:text-accent-strong";
}

export function alternativeOptionClass(options: {
	selected: boolean;
	revealed: boolean;
	isGabarito: boolean;
}): string {
	const { selected, revealed, isGabarito } = options;
	if (revealed && isGabarito) {
		return "border-success bg-success-soft";
	}
	if (revealed && selected && !isGabarito) {
		return "border-danger bg-danger-soft";
	}
	if (selected && !revealed) {
		return "border-accent bg-accent-soft ring-2 ring-accent/20";
	}
	return "border-border bg-background hover:border-accent/50 hover:bg-accent-soft/40";
}

export function feedbackPanelClass(
	correct: boolean | "anulada",
): string {
	if (correct === "anulada") {
		return "border-border bg-background";
	}
	return correct
		? "border-success/40 bg-success-soft"
		: "border-danger/40 bg-danger-soft";
}
