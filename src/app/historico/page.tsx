import type { Metadata } from "next";
import { HistoryList } from "@/components/history/history-list";

export const metadata: Metadata = {
	title: "Histórico",
};

export default function HistoricoPage() {
	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
					Histórico
				</h1>
				<p className="text-sm text-muted sm:text-base">
					Tentativas salvas neste navegador (localStorage).
				</p>
			</header>

			<HistoryList />
		</div>
	);
}
