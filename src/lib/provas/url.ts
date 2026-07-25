export function buildProvaHref(provaId: string, disciplina?: string): string {
	const basePath = `/provas/${provaId}`;
	if (!disciplina) {
		return basePath;
	}
	const params = new URLSearchParams({ disciplina });
	return `${basePath}?${params.toString()}`;
}

export function parseProvaSearchParams(query: {
	disciplina?: string;
	q?: string;
}): { disciplina?: string; initialNumero?: number } {
	const disciplina =
		query.disciplina && query.disciplina.trim() !== ""
			? query.disciplina
			: undefined;
	const parsed = query.q ? Number.parseInt(query.q, 10) : Number.NaN;
	return {
		disciplina,
		initialNumero: Number.isFinite(parsed) ? parsed : undefined,
	};
}
