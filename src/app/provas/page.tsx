import type { Metadata } from "next";
import Link from "next/link";
import { getProvaRepository } from "@/lib/questions";

export const metadata: Metadata = {
	title: "Provas",
};

export default async function ProvasPage() {
	const provas = await getProvaRepository().listProvas();

	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
					Provas
				</h1>
				<p className="max-w-2xl text-sm text-muted sm:text-base">
					Escolha uma prova para treinar questão a questão, com filtro por
					disciplina e histórico local.
				</p>
			</header>

			<ul className="flex flex-col gap-4">
				{provas.map((prova) => (
					<li key={prova.id}>
						<Link
							href={`/provas/${prova.id}`}
							className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
						>
							<h2 className="font-display text-xl font-semibold text-foreground">
								{prova.titulo}
							</h2>
							<p className="mt-2 text-sm text-muted">
								{prova.orgao} · {prova.cargo}
							</p>
							<p className="mt-1 text-sm text-muted">
								{prova.banca} · {prova.ano} · {prova.edital}
							</p>
							<p className="mt-4 text-sm font-semibold text-accent">
								{prova.questoes.length} questões →
							</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
