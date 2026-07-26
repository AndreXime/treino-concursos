import type { ReactNode } from "react";

/** Converte *destaque* do JSON em <strong> (negrito do PDF). */
export function renderEmphasis(text: string): ReactNode {
	const nodes: ReactNode[] = [];
	const pattern = /\*([^*]+)\*/g;
	let lastIndex = 0;
	let match = pattern.exec(text);
	let key = 0;

	while (match !== null) {
		if (match.index > lastIndex) {
			nodes.push(text.slice(lastIndex, match.index));
		}
		nodes.push(<strong key={`em-${key}`}>{match[1]}</strong>);
		key += 1;
		lastIndex = match.index + match[0].length;
		match = pattern.exec(text);
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	return nodes.length > 0 ? nodes : text;
}
