import type { ReactNode } from "react";
import { IMAGE_PLACEHOLDER_RE } from "@/lib/questions/images";

interface RenderQuestionContentOptions {
	/** Mapa `N` → URL pública (de `prova.imagens`). */
	imagens?: Record<string, string>;
}

function isTableRow(line: string): boolean {
	const t = line.trim();
	return t.startsWith("|") && t.endsWith("|") && t.includes("|", 1);
}

function isSeparatorRow(line: string): boolean {
	return /^\|[\s:|-]+\|$/.test(line.trim());
}

function splitCells(line: string): string[] {
	const t = line.trim();
	return t
		.slice(1, -1)
		.split("|")
		.map((cell) => cell.trim());
}

function renderMarkdownTable(lines: string[], key: string): ReactNode {
	const rows = lines.filter((line) => !isSeparatorRow(line)).map(splitCells);
	if (rows.length === 0) {
		return null;
	}
	const [header, ...body] = rows;

	const headerCells: ReactNode[] = [];
	for (const [column, cell] of header.entries()) {
		headerCells.push(
			<th
				key={`${key}-h-${column}`}
				className="border border-border px-2 py-1.5 font-semibold text-foreground"
			>
				{cell || "\u00a0"}
			</th>,
		);
	}

	const bodyRows: ReactNode[] = [];
	for (const [rowIndex, row] of body.entries()) {
		const cells: ReactNode[] = [];
		for (const [column, cell] of row.entries()) {
			cells.push(
				<td
					key={`${key}-r-${rowIndex}-c-${column}`}
					className="border border-border px-2 py-1.5 align-top text-foreground"
				>
					{cell || "\u00a0"}
				</td>,
			);
		}
		bodyRows.push(<tr key={`${key}-r-${rowIndex}`}>{cells}</tr>);
	}

	return (
		<div key={key} className="my-4 overflow-x-auto">
			<table className="w-max min-w-full border-collapse text-left text-sm sm:text-base">
				<thead>
					<tr className="bg-accent-soft/60">{headerCells}</tr>
				</thead>
				<tbody>{bodyRows}</tbody>
			</table>
		</div>
	);
}

function renderSegment(text: string, keyPrefix: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	const pattern = /\*([^*]+)\*/g;
	let lastIndex = 0;
	let match = pattern.exec(text);
	let key = 0;

	while (match !== null) {
		if (match.index > lastIndex) {
			nodes.push(text.slice(lastIndex, match.index));
		}
		nodes.push(<strong key={`${keyPrefix}-em-${key}`}>{match[1]}</strong>);
		key += 1;
		lastIndex = match.index + match[0].length;
		match = pattern.exec(text);
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	return nodes;
}

function renderInlineContent(
	text: string,
	options: RenderQuestionContentOptions,
	keyPrefix: string,
): ReactNode[] {
	const nodes: ReactNode[] = [];
	const pattern = new RegExp(IMAGE_PLACEHOLDER_RE.source, "gi");
	let lastIndex = 0;
	let match = pattern.exec(text);
	let key = 0;

	while (match !== null) {
		if (match.index > lastIndex) {
			nodes.push(
				...renderSegment(
					text.slice(lastIndex, match.index),
					`${keyPrefix}-t${key}`,
				),
			);
		}

		const imageNumber = match[1];
		const src = options.imagens?.[imageNumber];
		if (src) {
			nodes.push(
				// Figuras de prova: tamanho variável; next/image exige width/height fixos.
				// biome-ignore lint/performance/noImgElement: diagramas estáticos em /public
				<img
					key={`${keyPrefix}-img-${key}`}
					src={src}
					alt={`Figura ${imageNumber}`}
					className="my-3 block h-auto max-w-full rounded-lg border border-border bg-background"
				/>,
			);
		} else {
			nodes.push(
				<span
					key={`${keyPrefix}-img-missing-${key}`}
					className="my-2 inline-block rounded-md bg-accent-soft px-2 py-1 text-xs text-muted"
				>
					[Figura {imageNumber} indisponível]
				</span>,
			);
		}

		key += 1;
		lastIndex = match.index + match[0].length;
		match = pattern.exec(text);
	}

	if (lastIndex < text.length) {
		nodes.push(...renderSegment(text.slice(lastIndex), `${keyPrefix}-t${key}`));
	}

	return nodes;
}

/**
 * Converte `*destaque*` em <strong>, `$$ IMAGE N $$` em <img>
 * e blocos `| tabela |` markdown em <table>.
 */
export function renderQuestionContent(
	text: string,
	options: RenderQuestionContentOptions = {},
): ReactNode {
	const lines = text.replace(/\r\n/g, "\n").split("\n");
	const nodes: ReactNode[] = [];
	let proseLines: string[] = [];
	let blockKey = 0;

	const flushProse = () => {
		if (proseLines.length === 0) {
			return;
		}
		const prose = proseLines.join("\n");
		proseLines = [];
		const inline = renderInlineContent(prose, options, `p${blockKey}`);
		if (inline.length === 1 && typeof inline[0] === "string") {
			nodes.push(inline[0]);
		} else if (inline.length > 0) {
			nodes.push(<span key={`p${blockKey}`}>{inline}</span>);
		}
		blockKey += 1;
	};

	let i = 0;
	while (i < lines.length) {
		if (isTableRow(lines[i])) {
			flushProse();
			const tableLines: string[] = [];
			while (i < lines.length && isTableRow(lines[i])) {
				tableLines.push(lines[i]);
				i += 1;
			}
			const table = renderMarkdownTable(tableLines, `tbl-${blockKey}`);
			if (table) {
				nodes.push(table);
				blockKey += 1;
			}
			continue;
		}
		proseLines.push(lines[i]);
		i += 1;
	}
	flushProse();

	if (nodes.length === 0) {
		return text;
	}
	if (nodes.length === 1 && typeof nodes[0] === "string") {
		return nodes[0];
	}
	return nodes;
}

/** @deprecated Use `renderQuestionContent`. */
export function renderEmphasis(text: string): ReactNode {
	return renderQuestionContent(text);
}
