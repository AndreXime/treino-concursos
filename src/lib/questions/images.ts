/** Placeholder gerado pelo extract-pdf: `$$ IMAGE 7 $$`. */
export const IMAGE_PLACEHOLDER_RE = /\$\$\s*IMAGE\s+(\d+)\s*\$\$/gi;

export function collectImageNumbers(...texts: string[]): number[] {
	const nums = new Set<number>();
	for (const text of texts) {
		IMAGE_PLACEHOLDER_RE.lastIndex = 0;
		for (const match of text.matchAll(IMAGE_PLACEHOLDER_RE)) {
			nums.add(Number.parseInt(match[1], 10));
		}
	}
	return [...nums].sort((a, b) => a - b);
}

export function provaImagesPublicUrl(
	provaId: string,
	fileName: string,
): string {
	return `/provas/${provaId}/images/${fileName}`;
}

export function provaImagesPublicBase(provaId: string): string {
	return `/provas/${provaId}/images`;
}
