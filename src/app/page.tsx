import Link from "next/link";

export default function HomePage() {
	return (
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
						<Link
							href="/provas"
							className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent-strong shadow-sm transition-colors hover:bg-accent-soft"
						>
							Ver provas
						</Link>
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
	);
}
