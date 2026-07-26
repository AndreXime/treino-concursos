import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProvaSession } from "@/components/questions/prova-session";
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
		<ProvaSession
			prova={prova}
			questions={questions}
			disciplinas={options.disciplinas}
			disciplina={disciplina}
			initialNumero={initialNumero}
		/>
	);
}
