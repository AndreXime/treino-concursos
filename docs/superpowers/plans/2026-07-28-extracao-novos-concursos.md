# Extração Caixa / CNU / INSS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generalizar o pipeline de `src/data/lib`, extrair JSONs editoriais de Caixa 2024, CNU 2024 Bloco 8 e INSS 2022, e adaptar schema/UI para múltipla escolha e Certo/Errado (com itens anulados).

**Architecture:** Configs por concurso em `src/data/lib/concursos/`; parsers Cesgranrio (A–E) e Cebraspe (C/E); comandos `extract` → `build` → `validate` por slug; schema `Question.tipo`; UI trata C/E e `gabaritoId: "x"`.

**Tech Stack:** TypeScript, `tsx`, `pdf-parse`, Next.js/React (UI), `node:test` + `node:assert/strict`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-28-extracao-novos-concursos-design.md`
- Escopo: Caixa + CNU Bloco 8 manhã Gabarito 1 + INSS (básico+específico); sem TRT7/OCR
- Um JSON por concurso; INSS mesclado
- Qualidade editorial nível BB (textos de apoio, limpeza)
- Sem em/en dashes; PT-BR
- Zero `any`; Conventional Commits só em mensagens de commit
- Mobile-first; layouts horizontais só a partir de `lg`

## File map

| File | Role |
|------|------|
| `src/lib/questions/types.ts` | `QuestionTipo`, `tipo` em `Question` |
| `src/lib/questions/question-tipo.ts` | Helpers `resolveQuestionTipo`, `isQuestionAnulada` |
| `src/lib/questions/answer.ts` | Respeitar anulado (não registrar acerto/erro) |
| `src/hooks/use-question-resolver.ts` | Fluxo anulado |
| `src/components/questions/question-resolver.tsx` | UI C/E + feedback anulado |
| `src/data/lib/concursos/types.ts` | Tipo `ConcursoConfig` |
| `src/data/lib/concursos/index.ts` | Registry `getConcurso(slug)` |
| `src/data/lib/concursos/bb-ac.ts` | Configs BB A/B/C |
| `src/data/lib/concursos/caixa-2024.ts` | Config Caixa |
| `src/data/lib/concursos/cnu-2024-b8.ts` | Config CNU Bloco 8 |
| `src/data/lib/concursos/inss-2022.ts` | Config INSS |
| `src/data/lib/parsers/cesgranrio.ts` | Parse A–E + textos de apoio |
| `src/data/lib/parsers/cebraspe.ts` | Parse C/E + textos-base |
| `src/data/lib/gabarito.ts` | Parse gabarito Cesgranrio/Cebraspe |
| `src/data/lib/shared.ts` | Utils de texto; remover hardcode BB onde migrar |
| `src/data/lib/extract-pdf.mts` | Extrai por slug do config |
| `src/data/lib/build-prova.mts` | Gera JSON |
| `src/data/lib/validate-prova.mts` | Valida por slug |
| `src/data/lib/fix-prova.mts` | Fix por slug |
| `src/data/lib/README.md` | Comandos atualizados |
| `src/data/provas.ts` | Importa 3 provas novas |
| `src/data/*.json` | BB migrados + 3 novos |

---

### Task 1: Schema `tipo` + helpers

**Files:**
- Modify: `src/lib/questions/types.ts`
- Create: `src/lib/questions/question-tipo.ts`
- Create: `src/lib/questions/question-tipo.test.ts`
- Modify: `src/lib/history/progress.test.ts` (stub `tipo` se o stub quebrar tipagem)

**Interfaces:**
- Produces: `export type QuestionTipo = "multipla" | "certo_errado"`
- Produces: `Question.tipo: QuestionTipo`
- Produces: `resolveQuestionTipo(q: Pick<Question, "tipo">): QuestionTipo`
- Produces: `isQuestionAnulada(q: Pick<Question, "gabaritoId">): boolean`

- [ ] **Step 1: Write failing tests**

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	isQuestionAnulada,
	resolveQuestionTipo,
} from "./question-tipo";

describe("resolveQuestionTipo", () => {
	it("defaults missing tipo to multipla", () => {
		assert.equal(resolveQuestionTipo({} as { tipo?: "multipla" }), "multipla");
	});

	it("returns certo_errado when set", () => {
		assert.equal(
			resolveQuestionTipo({ tipo: "certo_errado" }),
			"certo_errado",
		);
	});
});

describe("isQuestionAnulada", () => {
	it("detects gabarito x", () => {
		assert.equal(isQuestionAnulada({ gabaritoId: "x" }), true);
		assert.equal(isQuestionAnulada({ gabaritoId: "c" }), false);
	});
});
```

- [ ] **Step 2: Run tests (expect FAIL)**

Run: `node --import tsx --test src/lib/questions/question-tipo.test.ts`  
Expected: FAIL (módulo inexistente)

- [ ] **Step 3: Implement types + helpers**

Em `types.ts`, adicionar:

```ts
export type QuestionTipo = "multipla" | "certo_errado";

export interface Question {
	id: string;
	provaId: string;
	numero: number;
	enunciado: string;
	alternativas: QuestionOption[];
	gabaritoId: string;
	disciplina: string;
	tipo: QuestionTipo;
}
```

Em `question-tipo.ts`:

```ts
import type { Question, QuestionTipo } from "./types";

export function resolveQuestionTipo(
	question: Pick<Question, "tipo"> | { tipo?: QuestionTipo },
): QuestionTipo {
	return question.tipo ?? "multipla";
}

export function isQuestionAnulada(
	question: Pick<Question, "gabaritoId">,
): boolean {
	return question.gabaritoId.toLowerCase() === "x";
}
```

Atualizar stub em `progress.test.ts` com `tipo: "multipla"`.

- [ ] **Step 4: Run tests (expect PASS)**

Run: `node --import tsx --test src/lib/questions/question-tipo.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/questions/types.ts src/lib/questions/question-tipo.ts src/lib/questions/question-tipo.test.ts src/lib/history/progress.test.ts
git commit -m "feat(questions): adicionar tipo multipla/certo_errado"
```

---

### Task 2: Answer + UI para anulado e C/E

**Files:**
- Modify: `src/lib/questions/answer.ts`
- Create: `src/lib/questions/answer.test.ts`
- Modify: `src/hooks/use-question-resolver.ts`
- Modify: `src/components/questions/question-resolver.tsx`
- Modify: `src/lib/ui/question-styles.ts` (se precisar estilo neutro para anulado)
- Modify: `src/lib/ui/question-styles.test.ts` (se alterar)

**Interfaces:**
- Consumes: `isQuestionAnulada`, `resolveQuestionTipo`
- Produces: `registerQuestionAttempt` retorna `boolean | null` (`null` = anulado, sem histórico de acerto/erro)
- Produces: UI com feedback “Item anulado”

- [ ] **Step 1: Write failing answer tests**

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAnswerCorrect, registerQuestionAttempt } from "./answer";
import type { Prova, Question } from "./types";

const prova = { id: "p", titulo: "T" } as Prova;
const anulada: Question = {
	id: "p-q01",
	provaId: "p",
	numero: 1,
	enunciado: "item",
	alternativas: [
		{ id: "c", texto: "Certo" },
		{ id: "e", texto: "Errado" },
	],
	gabaritoId: "x",
	disciplina: "Ética",
	tipo: "certo_errado",
};

describe("anulado", () => {
	it("registerQuestionAttempt returns null and does not count", () => {
		assert.equal(registerQuestionAttempt(prova, anulada, "c"), null);
	});

	it("isAnswerCorrect is false for anulado even if ids match accidentally", () => {
		assert.equal(isAnswerCorrect(anulada, "x"), false);
	});
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `node --import tsx --test src/lib/questions/answer.test.ts`

- [ ] **Step 3: Implement answer + hook + UI**

`answer.ts`:

```ts
export function isAnswerCorrect(
	question: Question,
	selectedOptionId: string,
): boolean {
	if (isQuestionAnulada(question)) return false;
	return selectedOptionId === question.gabaritoId;
}

export function registerQuestionAttempt(
	prova: Prova,
	question: Question,
	selectedOptionId: string,
): boolean | null {
	if (isQuestionAnulada(question)) {
		return null;
	}
	const correct = isAnswerCorrect(question, selectedOptionId);
	addAttempt({ /* igual ao atual */ });
	return correct;
}
```

`use-question-resolver.ts`:

- `conferir`: se anulado, `setRevealed(true)` e **não** chama `onAnswered`.
- Expor `isAnulada: isQuestionAnulada(question)`.

`question-resolver.tsx`:

- Feedback: se `isAnulada && revealed` → título “Item anulado”, texto explicando que o item não pontua; **não** mostrar “Resposta correta/incorreta”.
- Alternativas: renderizar `question.alternativas` como já faz (C/E vem no JSON com 2 itens).
- Hotkeys: já filtram por `question.alternativas`; sem mudança obrigatória em `session-hotkeys.ts`.
- Para anulado revelado, estilo de painel neutro (borda `--border`, sem verde/vermelho de acerto/erro). Se `feedbackPanelClass` só aceita boolean, adicionar variante `anulada` ou classe local.

Ajustar `onAnswered` callers se tipagem de `conferir` mudar (só deixa de chamar no anulado).

- [ ] **Step 4: Run tests**

Run: `node --import tsx --test src/lib/questions/answer.test.ts src/lib/questions/question-tipo.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/questions/answer.ts src/lib/questions/answer.test.ts src/hooks/use-question-resolver.ts src/components/questions/question-resolver.tsx src/lib/ui/question-styles.ts src/lib/ui/question-styles.test.ts
git commit -m "feat(questions): UI e scoring para anulado e certo/errado"
```

---

### Task 3: Tipos de config + registry de concursos

**Files:**
- Create: `src/data/lib/concursos/types.ts`
- Create: `src/data/lib/concursos/index.ts`
- Create: `src/data/lib/concursos/bb-ac.ts`
- Create: `src/data/lib/concursos/caixa-2024.ts`
- Create: `src/data/lib/concursos/cnu-2024-b8.ts`
- Create: `src/data/lib/concursos/inss-2022.ts`
- Create: `src/data/lib/concursos/concursos.test.ts`

**Interfaces:**
- Produces:

```ts
export type ParserKind = "cesgranrio" | "cebraspe";

export interface DisciplinaRange {
	nome: string;
	de: number;
	ate: number;
}

export interface ProvaPdfSource {
	/** Nome do arquivo em src/data/raw/ */
	fileName: string;
	/** Sufixo do artefact dir se multi-pdf (ex. basicos) */
	artefactKey?: string;
}

export interface GabaritoSource {
	fileName: string;
	/** Cesgranrio: número do gabarito; Cebraspe: ignorar */
	gabaritoNumero?: number;
	/** Marker textual para isolar bloco (ex. BLOCO 8 … GABARITO 1) */
	blockMarker?: string;
}

export interface ConcursoConfig {
	slug: string;
	parser: ParserKind;
	tipo: QuestionTipo;
	expectedCount: number;
	prova: {
		id: string;
		titulo: string;
		orgao: string;
		cargo: string;
		banca: string;
		ano: number;
		edital: string;
		jsonFileName: string;
	};
	provaPdfs: ProvaPdfSource[];
	gabaritos: GabaritoSource[];
	disciplinas: DisciplinaRange[];
	/** Regexes extras de ruído por linha (opcional) */
	pageNoisePatterns?: RegExp[];
}

export function getConcurso(slug: string): ConcursoConfig;
export function listConcursos(): ConcursoConfig[];
export function disciplinaDoNumero(
	disciplinas: DisciplinaRange[],
	n: number,
): string;
```

- [ ] **Step 1: Write registry test**

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getConcurso, listConcursos } from "./index";

describe("concursos registry", () => {
	it("resolves caixa slug", () => {
		const c = getConcurso("caixa-2024");
		assert.equal(c.parser, "cesgranrio");
		assert.equal(c.expectedCount, 60);
		assert.equal(c.tipo, "multipla");
	});

	it("resolves inss slug", () => {
		const c = getConcurso("inss-2022");
		assert.equal(c.parser, "cebraspe");
		assert.equal(c.expectedCount, 120);
		assert.equal(c.tipo, "certo_errado");
		assert.equal(c.provaPdfs.length, 2);
	});

	it("lists at least bb + 3 novos", () => {
		assert.ok(listConcursos().length >= 6);
	});
});
```

- [ ] **Step 2: Run (FAIL)**

Run: `node --import tsx --test src/data/lib/concursos/concursos.test.ts`

- [ ] **Step 3: Implement configs**

Slugs e metadados:

| slug | id | expectedCount | notas |
|------|-----|---------------|-------|
| `bb-ac-a` | `bb-ac-2022-a-g1` | 70 | PDF `PROVA A - AGENTE COMERCIAL - GABARITO 1.pdf` |
| `bb-ac-b` | `bb-ac-2022-b-g1` | 70 | idem B |
| `bb-ac-c` | `bb-ac-2022-c-g1` | 70 | idem C |
| `caixa-2024` | `caixa-2024-tbn-g1` | 60 | Prova + Gabarito; block `PROVA 1 - TÉCNICO BANCÁRIO NOVO - GABARITO 1` |
| `cnu-2024-b8` | `cnu-2024-b8-manha-g1` | 15 | block `BLOCO 8 – NÍVEL INTERMEDIÁRIO – LÍNGUA PORTUGUESA – MANHÃ – GABARITO 1` |
| `inss-2022` | `inss-2022-tss` | 120 | 2 provas + 2 gabaritos; itens 1–50 e 51–120 |

Disciplinas Caixa:

```ts
[
	{ nome: "Língua Portuguesa", de: 1, ate: 5 },
	{ nome: "Língua Inglesa", de: 6, ate: 10 },
	{ nome: "Matemática Financeira", de: 11, ate: 15 },
	{ nome: "Noções de Probabilidade e Estatística", de: 16, ate: 20 },
	{ nome: "Comportamentos Éticos e Compliance", de: 21, ate: 25 },
	{ nome: "Conhecimentos Bancários", de: 26, ate: 40 },
	{ nome: "Conhecimentos de Tecnologia da Informação e Comunicação", de: 41, ate: 45 },
	{ nome: "Conhecimentos e Comportamentos Digitais", de: 46, ate: 50 },
	{ nome: "Atendimento Bancário", de: 51, ate: 60 },
]
```

CNU: todas `Língua Portuguesa` 1–15.

INSS: mapear faixas a partir dos cabeçalhos do PDF na Task 7 (no config inicial, usar nomes provisórios coerentes com o caderno; ajustar após extract se preciso). Incluir pelo menos faixas cobrindo 1–120 sem buracos.

BB: reutilizar `DISCIPLINAS_BB_AC` de `shared.ts` (mover para `bb-ac.ts` e reexportar em `shared` se outros arquivos importam).

`getConcurso` lança se slug desconhecido.

- [ ] **Step 4: Run (PASS)**

Run: `node --import tsx --test src/data/lib/concursos/concursos.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/data/lib/concursos
git commit -m "feat(data): registry de configs por concurso"
```

---

### Task 4: Gabarito parser genérico

**Files:**
- Create: `src/data/lib/gabarito.ts`
- Create: `src/data/lib/gabarito.test.ts`
- Modify: `src/data/lib/shared.ts` (delegar ou remover `parseGabaritoPdf` / `findGabaritoPdf` BB-only)

**Interfaces:**
- Produces: `parseCesgranrioGabarito(text: string, opts: { blockMarker?: string; gabaritoNumero?: number }): Record<number, string>`
- Produces: `parseCebraspeGabarito(text: string): Record<number, string>` (`c`|`e`|`x`)
- Produces: `async loadGabaritoFromPdf(path: string, parser: ParserKind, opts): Promise<Record<number, string>>`
- Produces: `async loadConcursoGabarito(config: ConcursoConfig): Promise<Record<number, string>>` (merge se vários PDFs)

- [ ] **Step 1: Fixture-based unit tests**

Usar strings literais (não PDFs) cobrindo:

1. Bloco Caixa com `1-A 2-B ... 60-D`
2. Bloco CNU `BLOCO 8 … GABARITO 1` sem vazar para GABARITO 2
3. Cebraspe:

```
Item
Gabarito
1
E
2
C
49
X
50
C
```

Assert mapas esperados.

- [ ] **Step 2: Run FAIL**

Run: `node --import tsx --test src/data/lib/gabarito.test.ts`

- [ ] **Step 3: Implement**

- Cesgranrio: achar `blockMarker` ou `GABARITO ${n}`; cortar no próximo marcador similar; `matchAll` `/(\d+)\s*-\s*([A-E])/gi`.
- Cebraspe: `matchAll` de pares número + `[CEX]` em linhas consecutivas (regex multilinha); normalizar lower-case.
- `loadConcursoGabarito`: ler cada `config.gabaritos`, parse, Object.assign merge.

Manter wrapper em `shared.ts` para BB se `fix-prova` antigo ainda importar, ou atualizar imports na Task 5.

- [ ] **Step 4: PASS + smoke PDF Caixa**

Além do unit test, smoke opcional:

```bash
npx tsx -e "
import { loadConcursoGabarito } from './src/data/lib/gabarito.ts';
import { getConcurso } from './src/data/lib/concursos/index.ts';
const g = await loadConcursoGabarito(getConcurso('caixa-2024'));
console.log(Object.keys(g).length, g[1], g[60]);
"
```

Expected: `60 a d` (ou letras reais do gabarito 1).

- [ ] **Step 5: Commit**

```bash
git add src/data/lib/gabarito.ts src/data/lib/gabarito.test.ts src/data/lib/shared.ts
git commit -m "feat(data): parsers de gabarito Cesgranrio e Cebraspe"
```

---

### Task 5: Parsers de prova + extract/build/validate por slug

**Files:**
- Create: `src/data/lib/parsers/cesgranrio.ts`
- Create: `src/data/lib/parsers/cebraspe.ts`
- Create: `src/data/lib/parsers/cesgranrio.test.ts`
- Create: `src/data/lib/parsers/cebraspe.test.ts`
- Create: `src/data/lib/build-prova.mts`
- Modify: `src/data/lib/extract-pdf.mts`
- Modify: `src/data/lib/validate-prova.mts`
- Modify: `src/data/lib/fix-prova.mts`
- Modify: `src/data/lib/shared.ts` (reusar `formatEnunciado`, `parseAlternativas`, etc.)
- Modify: `src/data/lib/README.md`

**Interfaces:**
- Produces: `parseCesgranrioRaw(raw: string, config: ConcursoConfig): Map<number, ParsedQuestion>`
- Produces: `parseCebraspeRaw(raw: string, config: ConcursoConfig): Map<number, ParsedQuestion>`
- `ParsedQuestion` ganha `tipo` implícito via config; alternativas C/E fixas no Cebraspe:

```ts
const CERTO_ERRADO_ALTS = [
	{ id: "c", texto: "Certo" },
	{ id: "e", texto: "Errado" },
] as const;
```

- [ ] **Step 1: Unit tests com raw sintético**

Cesgranrio mínimo (1 questão + apoio):

```
TEXTO DE APOIO AQUI.

1
Pergunta?
(A) um
(B) dois
(C) tres
(D) quatro
(E) cinco
```

Assert enunciado contém apoio + pergunta e 5 alts.

Cebraspe mínimo:

```
Julgue o item.
1 Afirmação verdadeira.
2 Afirmação falsa.
```

Assert 2 questões, alts c/e, enunciados com base + item.

- [ ] **Step 2: FAIL then implement parsers**

Regras Cesgranrio (generalizar `extractQuestionsFromRaw`):

- Aceitar `expectedCount` do config (não hardcode 70).
- `stripPageNoise` aceitar `pageNoisePatterns` do config + patterns padrão (`-- N of M --`).
- Detectar bloco de texto de apoio: texto imediatamente antes do primeiro número de um grupo consecutivo; anexar a cada questão até mudança de disciplina/seção se detectável; se ambíguo, anexar o apoio mais recente visto antes do número (comportamento BB).

Regras Cebraspe:

- Remover banners de cookies / rodapés conhecidos.
- Itens: `(?:^|\n)(\d{1,3})\s+([A-ZÀ-Úa-zà-ú…][\s\S]*?)(?=(?:\n\d{1,3}\s+[A-ZÀ-Ú])|$)` ajustado empiricamente com fixtures.
- Prefixo de enunciado: último parágrafo “Julgue…” / texto-base acima do item.

- [ ] **Step 3: Wire CLI scripts**

`extract-pdf.mts`:

```
Uso: npx tsx src/data/lib/extract-pdf.mts <slug> [...]
```

Para cada `provaPdfs`, escrever `artefacts/<slug>/` ou `artefacts/<slug>-<artefactKey>/raw.txt`.

`build-prova.mts`:

1. `getConcurso(slug)`
2. Ler todos raw.txt do slug
3. Parse conforme `parser`
4. `loadConcursoGabarito`
5. Montar `Prova` com ids `${prova.id}-q${pad}`
6. Remover `$$ IMAGE N $$` dos enunciados
7. Escrever `src/data/${jsonFileName}`
8. Fail se count !== expectedCount ou faltar gabarito (exceto se quiser warning só para anulado — anulado **deve** ter chave `x`)

`validate-prova.mts <slug>`:

- Carregar JSON do config
- Checar count, ids, disciplinas, tipo, alts (5 ou 2), gabarito match
- BB: manter compat `validate-prova.mts <json> <A|B|C>` **ou** migrar 100% para slug (`bb-ac-a`); preferir slug e documentar no README.

`fix-prova.mts <slug>`: reaplica gabarito + `cleanAlternativeText`.

README: documentar slugs e fluxo extract → build → validate.

- [ ] **Step 4: Run parser unit tests PASS**

Run: `node --import tsx --test src/data/lib/parsers/*.test.ts src/data/lib/gabarito.test.ts src/data/lib/concursos/concursos.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/data/lib
git commit -m "feat(data): parsers e CLI extract/build/validate por slug"
```

---

### Task 6: Migrar JSONs BB com `tipo` + validar regressão

**Files:**
- Modify: `src/data/PROVA A - AGENTE COMERCIAL - GABARITO 1.json`
- Modify: `src/data/PROVA B - AGENTE COMERCIAL - GABARITO 1.json`
- Modify: `src/data/PROVA C - AGENTE COMERCIAL - GABARITO 1.json`

- [ ] **Step 1: Script one-shot ou edição**

Adicionar `"tipo": "multipla"` em cada questão dos 3 JSONs (script rápido com `tsx`/`jq` ok).

- [ ] **Step 2: Validate**

```bash
npx tsx src/data/lib/validate-prova.mts bb-ac-a
npx tsx src/data/lib/validate-prova.mts bb-ac-b
npx tsx src/data/lib/validate-prova.mts bb-ac-c
```

Expected: `OK` para os três.

- [ ] **Step 3: Commit**

```bash
git add src/data/PROVA*.json
git commit -m "chore(data): migrar provas BB com campo tipo"
```

---

### Task 7: Extrair e build Caixa 2024

**Files:**
- Create: `src/data/lib/artefacts/caixa-2024/raw.txt` (gitignored; gerar local)
- Create: `src/data/Caixa - 2024 - Tecnico Bancario Novo.json`
- Possibly tune: `src/data/lib/concursos/caixa-2024.ts`, `parsers/cesgranrio.ts`, noise patterns

- [ ] **Step 1: Extract**

```bash
npx tsx src/data/lib/extract-pdf.mts caixa-2024
```

Expected: `artefacts/caixa-2024/raw.txt` com texto das questões.

- [ ] **Step 2: Build**

```bash
npx tsx src/data/lib/build-prova.mts caixa-2024
```

- [ ] **Step 3: Validate**

```bash
npx tsx src/data/lib/validate-prova.mts caixa-2024
```

Se falhar: ajustar parser/noise/apoio até passar 60/60 e gabarito.

- [ ] **Step 4: Revisão editorial rápida**

Abrir JSON: questões 1–5 (português) devem ter texto de apoio “cidadania financeira” (ou equivalente do PDF) no enunciado; alts sem vazamento; sem `$$ IMAGE`.

Corrigir no parser ou patch pontual + rebuild.

- [ ] **Step 5: Commit**

```bash
git add "src/data/Caixa - 2024 - Tecnico Bancario Novo.json" src/data/lib/concursos/caixa-2024.ts src/data/lib/parsers src/data/lib/README.md
git commit -m "feat(data): prova Caixa 2024 Técnico Bancário Novo"
```

(Não commitar `artefacts/` se gitignored.)

---

### Task 8: Extrair e build CNU 2024 Bloco 8

**Files:**
- Create: `src/data/CNU - 2024 - Bloco 8 Nivel Intermediario.json`
- Tune: `cnu-2024-b8.ts`, gabarito `blockMarker`, cesgranrio noise

- [ ] **Step 1: Extract + build + validate**

```bash
npx tsx src/data/lib/extract-pdf.mts cnu-2024-b8
npx tsx src/data/lib/build-prova.mts cnu-2024-b8
npx tsx src/data/lib/validate-prova.mts cnu-2024-b8
```

Expected: 15 questões, gabarito 1 isolado do bloco 8 (não misturar outros blocos do PDF de gabaritos).

- [ ] **Step 2: Editorial**

Texto(s) de apoio de português repetidos nas 15 questões conforme padrão BB; disciplinas = Língua Portuguesa.

- [ ] **Step 3: Commit**

```bash
git add "src/data/CNU - 2024 - Bloco 8 Nivel Intermediario.json" src/data/lib/concursos/cnu-2024-b8.ts
git commit -m "feat(data): prova CNU 2024 Bloco 8 intermediário"
```

---

### Task 9: Extrair e build INSS 2022

**Files:**
- Create: `src/data/INSS - 2022 - Tecnico do Seguro Social.json`
- Tune: `inss-2022.ts` (disciplinas finais), `parsers/cebraspe.ts`

- [ ] **Step 1: Extract ambos cadernos**

```bash
npx tsx src/data/lib/extract-pdf.mts inss-2022
```

Expected: dois raw (basicos + especificos) sob artefacts.

- [ ] **Step 2: Ajustar mapa de disciplinas**

Ler cabeçalhos dos raw e preencher `disciplinas` em `inss-2022.ts` cobrindo 1–120 sem buracos. Anulados conhecidos do gabarito definitivo: 49, 54, 65, 68, 72, 74, 104, 106 → `gabaritoId: "x"`.

- [ ] **Step 3: Build + validate**

```bash
npx tsx src/data/lib/build-prova.mts inss-2022
npx tsx src/data/lib/validate-prova.mts inss-2022
```

Expected: 120 itens, `tipo: "certo_errado"`, alts c/e, anulados com `x`.

- [ ] **Step 4: Editorial Cebraspe**

Itens devem carregar o texto-base (“Julgue…”) relevante; remover lixo de cookies do site se vazou no PDF; figuras: sem leftover `$$ IMAGE`.

- [ ] **Step 5: Commit**

```bash
git add "src/data/INSS - 2022 - Tecnico do Seguro Social.json" src/data/lib/concursos/inss-2022.ts src/data/lib/parsers/cebraspe.ts
git commit -m "feat(data): prova INSS 2022 Técnico do Seguro Social"
```

---

### Task 10: Registrar em `provas.ts` + verificação final

**Files:**
- Modify: `src/data/provas.ts`
- Possibly: páginas de listagem se hardcodarem count (verificar)

- [ ] **Step 1: Registrar**

```ts
import caixa2024 from "@/data/Caixa - 2024 - Tecnico Bancario Novo.json";
import cnu2024b8 from "@/data/CNU - 2024 - Bloco 8 Nivel Intermediario.json";
import inss2022 from "@/data/INSS - 2022 - Tecnico do Seguro Social.json";
import provaA from "@/data/PROVA A - AGENTE COMERCIAL - GABARITO 1.json";
import provaB from "@/data/PROVA B - AGENTE COMERCIAL - GABARITO 1.json";
import provaC from "@/data/PROVA C - AGENTE COMERCIAL - GABARITO 1.json";
import type { Prova } from "@/lib/questions/types";

export const provas: Prova[] = [
	provaA,
	provaB,
	provaC,
	caixa2024,
	cnu2024b8,
	inss2022,
];
```

- [ ] **Step 2: Typecheck + unit tests + validates**

```bash
npx tsc --noEmit
node --import tsx --test src/lib/questions/*.test.ts src/lib/ui/*.test.ts src/lib/history/*.test.ts src/data/lib/concursos/*.test.ts src/data/lib/gabarito.test.ts src/data/lib/parsers/*.test.ts
npx tsx src/data/lib/validate-prova.mts caixa-2024
npx tsx src/data/lib/validate-prova.mts cnu-2024-b8
npx tsx src/data/lib/validate-prova.mts inss-2022
npx tsx src/data/lib/validate-prova.mts bb-ac-a
```

Expected: tudo OK / exit 0.

- [ ] **Step 3: Smoke manual UI**

`npm run dev` → abrir INSS → item anulado mostra “Item anulado”; item C/E só 2 opções; Caixa/CNU múltipla com 5.

- [ ] **Step 4: Commit**

```bash
git add src/data/provas.ts src/data/lib/README.md
git commit -m "feat(data): publicar Caixa, CNU e INSS no catálogo"
```

---

## Spec coverage checklist

| Requisito do spec | Task |
|-------------------|------|
| `tipo` no schema | 1 |
| UI C/E + anulado | 2 |
| Configs por concurso | 3 |
| Gabarito Cesgranrio/Cebraspe | 4 |
| Pipeline extract/build/validate | 5 |
| BB sem regressão + `tipo` | 6 |
| JSON Caixa | 7 |
| JSON CNU Bloco 8 G1 | 8 |
| JSON INSS mesclado C/E | 9 |
| `provas.ts` | 10 |
| README lib | 5, 10 |
| Sem TRT7 | (fora) |

## Placeholder / consistency self-review

- Sem TBD: slugs, counts (60/15/120), anulados INSS e disciplinas Caixa explícitos.
- INSS disciplinas finais ajustadas na Task 9 com base no raw (faixas provisórias só na Task 3).
- `registerQuestionAttempt` → `boolean | null` documentado nas Tasks 1–2.
- Nomes de arquivo JSON alinhados ao spec.
