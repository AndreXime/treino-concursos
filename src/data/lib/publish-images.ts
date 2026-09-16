import fs from "node:fs";
import { join } from "node:path";
import {
	collectImageNumbers,
	provaImagesPublicUrl,
} from "@/lib/questions/images";
import type { ConcursoConfig } from "./concursos";
import { ARTEFACTS_DIR, DATA_ROOT } from "./shared";

const PROJECT_ROOT = join(DATA_ROOT, "..", "..");
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp"] as const;

function artefactImagesDir(slug: string, artefactKey?: string): string {
	const dirName = artefactKey ? `${slug}-${artefactKey}` : slug;
	return join(ARTEFACTS_DIR, dirName, "images");
}

function findImageFile(imagesDir: string, n: number): string | null {
	for (const ext of IMAGE_EXTS) {
		const fileName = `image-${n}.${ext}`;
		if (fs.existsSync(join(imagesDir, fileName))) {
			return fileName;
		}
	}
	return null;
}

function listArtefactImageDirs(config: ConcursoConfig): string[] {
	const dirs: string[] = [];
	for (const source of config.provaPdfs) {
		const dir = artefactImagesDir(config.slug, source.artefactKey);
		if (fs.existsSync(dir)) {
			dirs.push(dir);
		}
	}
	return dirs;
}

/**
 * Copia imagens referenciadas por `$$ IMAGE N $$` para
 * `public/provas/<provaId>/images/` e devolve o mapa N → URL.
 */
export function publishProvaImages(
	config: ConcursoConfig,
	texts: string[],
): Record<string, string> {
	const numbers = collectImageNumbers(...texts);
	if (numbers.length === 0) {
		return {};
	}

	const sourceDirs = listArtefactImageDirs(config);
	if (sourceDirs.length === 0) {
		throw new Error(
			`Imagens referenciadas (${numbers.join(", ")}) sem pasta em artefacts. Rode extract-pdf.mts ${config.slug}`,
		);
	}

	const destDir = join(
		PROJECT_ROOT,
		"public",
		"provas",
		config.prova.id,
		"images",
	);
	fs.mkdirSync(destDir, { recursive: true });

	const imagens: Record<string, string> = {};
	const missing: number[] = [];

	for (const n of numbers) {
		let fileName: string | null = null;
		let sourcePath: string | null = null;
		for (const dir of sourceDirs) {
			const found = findImageFile(dir, n);
			if (found) {
				fileName = found;
				sourcePath = join(dir, found);
				break;
			}
		}
		if (!fileName || !sourcePath) {
			missing.push(n);
			continue;
		}
		fs.copyFileSync(sourcePath, join(destDir, fileName));
		imagens[String(n)] = provaImagesPublicUrl(config.prova.id, fileName);
	}

	if (missing.length > 0) {
		throw new Error(
			`Figuras sem arquivo em artefacts: ${missing.map((n) => `IMAGE ${n}`).join(", ")}`,
		);
	}

	return imagens;
}
