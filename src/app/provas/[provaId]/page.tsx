import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProvaPlayer } from "@/components/questions/prova-player";
import { QuestionFiltersForm } from "@/components/questions/question-filters";
import { parseProvaSearchParams } from "@/lib/provas/url";
import { getProvaRepository } from "@/lib/questions";

interface ProvaPageProps {
	params: Promise<{ provaId: string }>;
	searchParams: Promise<{ disciplina?: string; q?: string }>;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ provaId: string }>;
}): Promise<Metadata> {
	const { provaId } = await params;
	const prova = await getProvaRepository().getProvaById(provaId);
	return { title: prova?.titulo ?? "Prova não encontrada" };
}

export default async function ProvaPage({
	params,
	searchParams,
}: ProvaPageProps) {
	const { provaId } = await params;
	const { disciplina, initialNumero } = parseProvaSearchParams(
		await searchParams,
	);
	const repository = getProvaRepository();
	const prova = await repository.getProvaById(provaId);

	if (!prova) {
		notFound();
	}

	const [options, questions] = await Promise.all([
		repository.getFilterOptions(provaId),
		repository.listQuestoes(provaId, { disciplina }),
	]);

	return (
		<div className="space-y-6">
			<Link
				href="/"
				className="inline-flex text-sm font-medium text-muted hover:text-accent"
			>
				← Todas as provas
			</Link>

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
				disciplinas={options.disciplinas}
				current={{ disciplina }}
			/>

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
				/>
			)}
		</div>
	);
}
