export type TextosApoioType = {
	de: number;
	ate: number;
	texto: string;
}[];

export type DisciplinasRange = {
	readonly nome: string;
	readonly de: number;
	readonly ate: number;
}[];

export type GabaritoType = Record<number, string>;

/** Notas manuais (ex.: Dado com expoente) que o PDF não extrai direito. */
export type NotasEnunciadoType = Record<number, string>;

/** Substitui o enunciado inteiro (ex.: tabelas reescritas). */
export type EnunciadosOverrideType = Record<number, string>;

export function disciplinaDoNumero(
	numero: number,
	disciplinas: DisciplinasRange,
): string {
	const range = disciplinas.find((d) => numero >= d.de && numero <= d.ate);
	return range?.nome ?? "";
}

export function textoApoioDoNumero(
	numero: number,
	textosApoio: TextosApoioType,
): string | undefined {
	return textosApoio.find((t) => numero >= t.de && numero <= t.ate)?.texto;
}

export function aplicarEnunciadoOverride(
	enunciado: string,
	numero: number,
	overrides: EnunciadosOverrideType,
): string {
	return overrides[numero] ?? enunciado;
}

/** Troca/anexa nota no enunciado, removendo um Dado: extraído do PDF se houver. */
export function aplicarNotaEnunciado(
	enunciado: string,
	numero: number,
	notas: NotasEnunciadoType,
): string {
	const nota = notas[numero];
	if (!nota) {
		return enunciado;
	}
	const semDado = enunciado.replace(/\n\nDado:[\s\S]*$/i, "").trimEnd();
	return `${semDado}\n\n${nota}`;
}
