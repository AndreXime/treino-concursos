import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const LIB_ROOT = dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = join(LIB_ROOT, "..");
const RAW_DIR = join(DATA_ROOT, "raw");
const ARTEFACTS_DIR = join(LIB_ROOT, "artefacts");

const MIN_IMAGE_SIDE = 100;

interface ExportedImage {
	number: number;
	pageNumber: number;
	fileName: string;
}

function extensionForImage(data: Uint8Array): "png" | "jpg" {
	if (data[0] === 0xff && data[1] === 0xd8) {
		return "jpg";
	}
	return "png";
}

function imagePlaceholder(number: number): string {
	return `$$ IMAGE ${number} $$`;
}

function insertPlaceholdersInPage(
	pageText: string,
	placeholders: string[],
): string {
	if (placeholders.length === 0) {
		return pageText;
	}

	const lines = pageText.split("\n");
	const insertionAfterLine: number[] = [];

	for (
		let lineIndex = 0;
		lineIndex < lines.length && insertionAfterLine.length < placeholders.length;
		lineIndex++
	) {
		const line = lines[lineIndex].trimEnd();
		if (line.endsWith(":") && !line.trimStart().startsWith("=")) {
			insertionAfterLine.push(lineIndex);
		}
	}

	while (insertionAfterLine.length < placeholders.length) {
		insertionAfterLine.push(Math.max(lines.length - 1, 0));
	}

	for (let index = placeholders.length - 1; index >= 0; index--) {
		const afterLine = insertionAfterLine[index];
		lines.splice(afterLine + 1, 0, "", placeholders[index], "");
	}

	return lines.join("\n");
}

async function exportEmbeddedImages(
	parser: PDFParse,
	imagesDir: string,
): Promise<Map<number, ExportedImage[]>> {
	const images = await parser.getImage({
		imageThreshold: 0,
		imageDataUrl: false,
		imageBuffer: true,
	});

	fs.rmSync(imagesDir, { recursive: true, force: true });
	fs.mkdirSync(imagesDir, { recursive: true });

	const byPage = new Map<number, ExportedImage[]>();
	let imageNumber = 1;

	for (const page of images.pages) {
		for (const image of page.images) {
			if (image.width < MIN_IMAGE_SIDE || image.height < MIN_IMAGE_SIDE) {
				continue;
			}

			const extension = extensionForImage(image.data);
			const fileName = `image-${imageNumber}.${extension}`;
			fs.writeFileSync(join(imagesDir, fileName), Buffer.from(image.data));

			const exported: ExportedImage = {
				number: imageNumber,
				pageNumber: page.pageNumber,
				fileName,
			};
			const pageImages = byPage.get(page.pageNumber) ?? [];
			pageImages.push(exported);
			byPage.set(page.pageNumber, pageImages);
			imageNumber += 1;
		}
	}

	return byPage;
}

function buildTextWithImagePlaceholders(
	pages: Array<{ num: number; text: string }>,
	totalPages: number,
	imagesByPage: Map<number, ExportedImage[]>,
): string {
	return pages
		.map((page) => {
			const placeholders = (imagesByPage.get(page.num) ?? []).map((image) =>
				imagePlaceholder(image.number),
			);
			const pageText = insertPlaceholdersInPage(page.text, placeholders);
			return `${pageText.trimEnd()}\n\n-- ${page.num} of ${totalPages} --`;
		})
		.join("\n\n");
}

function resolveProvaPdf(slug: string): string {
	const files = fs.readdirSync(RAW_DIR);
	const match = files.find(
		(name) =>
			name.startsWith(`PROVA ${slug} `) &&
			name.endsWith(".pdf") &&
			!name.startsWith("GABARITO"),
	);
	if (!match) {
		throw new Error(`PDF da prova ${slug} não encontrado em ${RAW_DIR}`);
	}
	return join(RAW_DIR, match);
}

async function extractProva(slug: string) {
	const pdfPath = resolveProvaPdf(slug);
	const outDir = join(ARTEFACTS_DIR, `PROVA-${slug}`);
	const imagesDir = join(outDir, "images");
	fs.mkdirSync(outDir, { recursive: true });

	const dataBuffer = fs.readFileSync(pdfPath);
	const parser = new PDFParse({ data: dataBuffer });

	try {
		const textResult = await parser.getText({ pageJoiner: "" });
		const imagesByPage = await exportEmbeddedImages(parser, imagesDir);
		const output = buildTextWithImagePlaceholders(
			textResult.pages,
			textResult.total,
			imagesByPage,
		);

		const rawPath = join(outDir, "raw.txt");
		fs.writeFileSync(rawPath, `${output.trimEnd()}\n`);

		const exported = [...imagesByPage.values()].flat();
		console.log(`Prova ${slug}: ${rawPath}`);
		if (exported.length > 0) {
			console.log(`  ${exported.length} imagem(ns) em ${imagesDir}`);
			for (const image of exported) {
				console.log(
					`  ${imagePlaceholder(image.number)} -> ${image.fileName} (pág. ${image.pageNumber})`,
				);
			}
		} else {
			console.log("  Nenhuma imagem relevante.");
		}
	} finally {
		await parser.destroy();
	}
}

const slugs = process.argv.slice(2).map((s) => s.toUpperCase());
if (slugs.length === 0) {
	console.error("Uso: npx tsx extract-pdf.mts A [B] [C]");
	process.exit(1);
}

for (const slug of slugs) {
	await extractProva(slug);
}
