import Link from "next/link";
import { getProvaRepository } from "@/lib/questions";

export default async function HomePage() {
	const provas = await getProvaRepository().listProvas();

	return (
		<div className="space-y-10 sm:space-y-12">
			<section className="home-hero" aria-labelledby="home-hero-brand">
				<div className="home-hero-grain" aria-hidden />
				<div className="home-hero-inner">
					<div className="max-w-3xl">
						<p
							id="home-hero-brand"
							className="home-hero-rise font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
						>
							Treino Concursos
						</p>
						<h1 className="home-hero-rise home-hero-rise-delay-1 mt-5 font-display text-2xl font-semibold leading-snug tracking-tight text-white/95 sm:text-3xl">
							Treine por prova, com foco.
						</h1>
						<p className="home-hero-rise home-hero-rise-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
							Escolha uma prova, filtre por disciplina se quiser e resolva uma
							questão por vez.
						</p>
						<div className="home-hero-rise home-hero-rise-delay-3 mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
							<a
								href="#provas"
								className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent-strong shadow-sm transition-colors hover:bg-accent-soft"
							>
								Ver provas
							</a>
							<Link
								href="/historico"
								className="inline-flex items-center justify-center rounded-lg border border-white/45 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
							>
								Meu histórico
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section id="provas" className="scroll-mt-8 space-y-4">
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
			</section>
		</div>
	);
}
