import * as fs from "node:fs";
import { PDFParse } from "pdf-parse";
import type { Question, QuestionOption } from "../lib/questions/types";

const PROVA_ID = "bb-ac-2022-a-g1";

const ALT_IDS = ["a", "b", "c", "d", "e"] as const;

/** Ruído de página/seção colado depois da última alternativa (não inclui Dado:). */
const NOISE_AFTER_ALTERNATIVA =
	/\n(?:--\s*\d+\s*of\s*\d+\s*--|CONHECIMENTOS\b|L[IÍ]NGUA\b|MATEM[AÁ]TICA\b|ATUALIDADES\b|VENDAS\b|RASCUNHO\b|BANCO DO BRASIL\b|AGENTE COMERCIAL\b).*$/is;

const TRAILING_DADO = /\n\s*(Dado:\s*[\s\S]+)$/i;

function joinBrokenHyphens(text: string): string {
	return (
		text
			// Quebra com hífen nos dois lados: pré-\n-definidos
			.replace(/(\p{L})-\s*-(\p{L})/gu, "$1-$2")
			// Quebra de linha tipográfica: palavra-\ncontinuação
			.replace(/(\p{L})-\n(\p{L})/gu, "$1$2")
			// pdf-parse às vezes já troca o \n por espaço: palavra- continuação
			.replace(/(\p{L})-\s+(\p{L})/gu, "$1$2")
	);
}

/** Recupera glifos que o PDF achata (º, nº, aspas de fórmula). */
function fixPdfGlyphs(text: string): string {
	return text
		.replace(/(\d)o(?=\s+(?:mês|meses|ano|anos|dia|dias)\b)/gi, "$1º")
		.replace(/\b(Lei|Carta Circular)\s+no\s+(?=\d)/g, "$1 nº ")
		.replace(/\b(Resolução(?:\s+[\p{L}.]+)?)\s+no\s+(?=\d)/gu, "$1 nº ")
		.replace(/[“”„«»]/g, '"')
		.replace(/[‘’]/g, "'");
}

function flattenInline(text: string): string {
	return fixPdfGlyphs(
		joinBrokenHyphens(text)
			.replace(/\r\n/g, "\n")
			.replace(/[ \t]+\n/g, "\n")
			.replace(/\n+/g, " ")
			.replace(/\s{2,}/g, " ")
			.trim(),
	);
}

/** Linhas que devem manter quebra (tabela, lista, reticências de sequência). */
function isStructuralLine(line: string): boolean {
	const t = line.trim();
	if (!t) {
		return false;
	}
	if (t.includes("\t")) {
		return true;
	}
	if (t.includes("|")) {
		return true;
	}
	if (/^\d+[).]/.test(t)) {
		return true;
	}
	if (/→/.test(t)) {
		return true;
	}
	if (/^[.\u2026\s]+$/.test(t) && /[.\u2026]/.test(t)) {
		return true;
	}
	// Células separadas por 2+ espaços
	if (/\S+\s{2,}\S+\s{2,}\S+/.test(t)) {
		return true;
	}
	// Linha só com números / ? (linha de tabela)
	if (/^[\d.?]+(?:\s+[\d.?]+)+$/.test(t)) {
		return true;
	}
	return false;
}

/**
 * Acha texto corrido, mas preserva quebras em blocos de tabela/lista.
 */
function formatEnunciado(text: string): string {
	const normalized = joinBrokenHyphens(text.replace(/\r\n/g, "\n"));
	const lines = normalized.split("\n").map((line) => line.replace(/[ \t]+$/g, ""));

	const result: string[] = [];
	let proseBuf: string[] = [];

	const flushProse = () => {
		if (proseBuf.length === 0) {
			return;
		}
		result.push(proseBuf.join(" ").replace(/\s{2,}/g, " ").trim());
		proseBuf = [];
	};

	for (const line of lines) {
		const trimmed = line.trim();
		// Linhas vazias do pdf-parse costumam ser artefato de layout, não parágrafo.
		if (!trimmed) {
			continue;
		}
		if (isStructuralLine(line)) {
			flushProse();
			result.push(line.replace(/^\s+/, ""));
			continue;
		}
		proseBuf.push(trimmed);
	}
	flushProse();

	return fixPdfGlyphs(result.join("\n").trim());
}

function extractTrailingDado(bloco: string): {
	bloco: string;
	dado: string | null;
} {
	const match = bloco.match(TRAILING_DADO);
	if (!match || match.index === undefined) {
		return { bloco, dado: null };
	}
	const dadoBruto = match[1].trim();
	const dado = flattenInline(dadoBruto).replace(/^Dado:\s*/i, "Dado: ");
	return {
		bloco: bloco.slice(0, match.index),
		dado,
	};
}

function parseAlternativas(bloco: string): QuestionOption[] | null {
	const matches = Array.from(
		bloco.matchAll(/\(([A-E])\)\s*([\s\S]*?)(?=\([A-E]\)|$)/g),
	);

	if (matches.length < 5) {
		return null;
	}

	const porLetra = new Map<string, string>();
	for (const match of matches) {
		const letra = match[1].toLowerCase();
		let texto = match[2].replace(NOISE_AFTER_ALTERNATIVA, "").trim();
		texto = flattenInline(texto);
		porLetra.set(letra, texto);
	}

	const alternativas: QuestionOption[] = [];
	for (const id of ALT_IDS) {
		const texto = porLetra.get(id);
		if (!texto) {
			return null;
		}
		alternativas.push({ id, texto });
	}

	return alternativas;
}

function parseQuestionBlock(
	questionNumber: number,
	rawContent: string,
): Question | null {
	const semNumero = rawContent.replace(/^\d{1,2}\n/, "");
	const inicioAlternativas = semNumero.search(/\(A\)/);
	if (inicioAlternativas < 0) {
		return null;
	}

	let enunciado = formatEnunciado(semNumero.slice(0, inicioAlternativas));
	const { bloco: blocoAlternativas, dado } = extractTrailingDado(
		semNumero.slice(inicioAlternativas),
	);
	const alternativas = parseAlternativas(blocoAlternativas);
	if (!enunciado || !alternativas) {
		return null;
	}

	if (dado) {
		enunciado = `${enunciado}\n\n${dado}`;
	}

	return {
		id: `${PROVA_ID}-q${String(questionNumber).padStart(2, "0")}`,
		provaId: PROVA_ID,
		numero: questionNumber,
		enunciado,
		alternativas,
		gabaritoId: "",
		disciplina: "",
	};
}

export async function extractQuestionsFromPDF(
	pdfPath: string,
): Promise<Question[]> {
	const dataBuffer = fs.readFileSync(pdfPath);
	const parser = new PDFParse({ data: dataBuffer });
	const result = await parser.getText();
	const cleanText = result.text.replace(/\r\n/g, "\n");

	const questionRegex = /(?:^|\n)(\d{1,2})\n(?=\([A-E]\)|[A-ZÀ-Úa-zà-ú0-9])/g;
	const matches = Array.from(cleanText.matchAll(questionRegex));
	const questions: Question[] = [];

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const currentIndex = match.index;
		if (currentIndex === undefined) {
			continue;
		}

		const questionNumber = parseInt(match[1], 10);
		const nextIndex =
			i + 1 < matches.length ? matches[i + 1].index : cleanText.length;
		if (nextIndex === undefined) {
			continue;
		}

		let rawQuestionContent = cleanText
			.substring(currentIndex, nextIndex)
			.trim();

		rawQuestionContent = rawQuestionContent
			.replace(/AGENTE COMERCIAL\s*-\s*PROVA A/gi, "")
			.replace(/GABARITO \d+/gi, "")
			// Só remove cabeçalho de página; não o texto de alternativas como "(B) Banco do Brasil"
			.replace(/^\s*BANCO DO BRASIL\s*$/gim, "");

		if (questionNumber < 1 || questionNumber > 70) {
			continue;
		}
		if (!rawQuestionContent.includes("(A)")) {
			continue;
		}

		const question = parseQuestionBlock(questionNumber, rawQuestionContent);
		if (question) {
			questions.push(question);
		}
	}

	return questions.sort((a, b) => a.numero - b.numero);
}
