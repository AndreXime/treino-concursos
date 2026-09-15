export function buildProvasListHref(area?: string): string {
	const basePath = "/provas";
	if (!area) {
		return basePath;
	}
	const params = new URLSearchParams({ area });
	return `${basePath}?${params.toString()}`;
}

export function parseProvasListSearchParams(query: { area?: string }): {
	area?: string;
} {
	const area =
		query.area && query.area.trim() !== "" ? query.area.trim() : undefined;
	return area ? { area } : {};
}
