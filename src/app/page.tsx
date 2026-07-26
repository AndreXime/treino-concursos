import Link from "next/link";
import { getProvaRepository } from "@/lib/questions";

export default async function HomePage() {
	const provas = await getProvaRepository().listProvas();

	return (
		<section className="flex flex-col gap-10 py-6 lg:flex-row lg:items-start lg:gap-12 lg:py-10">
			<div className="flex flex-1 flex-col gap-8">
				<div className="max-w-xl">
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
						Treino Concursos
					</p>
					<h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
						Treine por prova, com foco e clareza.
					</h1>
					<p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
						Escolha uma prova, filtre por disciplina se quiser, resolva uma
						questão por vez e acompanhe seu histórico local.
					</p>
				</div>

				<div className="flex flex-col gap-3 lg:flex-row">
					<Link
						href="/historico"
						className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:bg-background"
					>
						Meu histórico
					</Link>
				</div>
			</div>

			<div id="provas" className="w-full flex-1 space-y-4">
				<h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
					Provas
				</h2>

				<ul className="flex flex-col gap-4">
					{provas.map((prova) => (
						<li key={prova.id}>
							<Link
								href={`/provas/${prova.id}`}
								className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
							>
								<h3 className="font-display text-xl font-semibold text-foreground">
									{prova.titulo}
								</h3>
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
		</section>
	);
}
