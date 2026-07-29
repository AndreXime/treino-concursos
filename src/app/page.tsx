import Link from "next/link";

export default function HomePage() {
	return (
		<section className="home-hero" aria-labelledby="home-hero-brand">
			<div className="home-hero-grain" aria-hidden />
			<div className="home-hero-inner home-hero-poster">
				<p className="home-hero-rise home-hero-kicker">Sessão de treino</p>

				<div className="home-hero-poster-main">
					<p id="home-hero-brand" className="home-hero-rise home-hero-brand">
						<span className="block">Treino</span>
						<span className="block">Concursos</span>
					</p>
					<h1 className="home-hero-rise home-hero-rise-delay-1 home-hero-tagline">
						Por prova, com foco.
					</h1>
				</div>

				<div className="home-hero-rise home-hero-rise-delay-2 home-hero-poster-foot">
					<p className="home-hero-support">
						Escolha uma prova, filtre por disciplina se quiser e resolva uma
						questão por vez.
					</p>
					<div className="home-hero-rise home-hero-rise-delay-3 home-hero-actions">
						<Link href="/provas" className="home-hero-cta-primary">
							Ver provas
						</Link>
						<Link href="/historico" className="home-hero-cta-secondary">
							Meu histórico
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
