# Filtro por área em `/provas` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir filtrar a listagem `/provas` por uma área de carreira via select e `?area=` na URL.

**Architecture:** Campo `area` no modelo `Prova` e nos configs de concurso; repositório filtra e lista áreas únicas; página `/provas` lê `searchParams` e um client select espelha o padrão de `QuestionFiltersForm`.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, Tailwind 4, Biome. Testes com `node:test` + `npx tsx --test`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-15-filtro-area-provas-design.md`
- Áreas iniciais: BB/Caixa → `Bancário`; INSS → `Previdência`; CNU B8 → `Administração pública`
- Um filtro por vez; match exato de string; área inválida → lista vazia + mensagem (sem 404)
- Sem filtro por cargo; sem multi-área
- Mobile-first; layout horizontal só a partir de `lg`
- Sem em/en dashes em texto novo; PT-BR
- Commits no estilo Conventional Commits (PT-BR)

## File map

| File | Role |
|------|------|
| `src/lib/questions/types.ts` | `area` em `Prova`; `ProvaListFilters`; `listAreas` no repo |
| `src/lib/questions/in-memory-repository.ts` | filtro + `listAreas` |
| `src/lib/questions/in-memory-repository.test.ts` | testes do filtro |
| `src/lib/questions/answer.test.ts` | fixture com `area` |
| `src/data/lib/concursos/types.ts` | `area` em `ConcursoConfig.prova` |
| `src/data/lib/concursos/{bb-ac,caixa-2024,inss-2022,cnu-2024-b8}.ts` | valores de área |
| `src/data/lib/parsers/{cesgranrio,cebraspe}.test.ts` | fixtures com `area` |
| `src/data/lib/build-prova.mts` | emitir `area` |
| `src/data/lib/validate-prova.mts` | validar `area` |
| `src/data/*.json` (4 provas) | metadado `area` |
| `src/lib/provas/list-url.ts` | `buildProvasListHref` / `parseProvasListSearchParams` |
| `src/lib/provas/list-url.test.ts` | testes de URL |
| `src/components/provas/prova-list-filters.tsx` | select client |
| `src/app/provas/page.tsx` | searchParams + lista filtrada + área no card |

---

### Task 1: Tipos + repositório com filtro por área

**Files:**
- Modify: `src/lib/questions/types.ts`
- Modify: `src/lib/questions/in-memory-repository.ts`
- Create: `src/lib/questions/in-memory-repository.test.ts`
- Modify: `src/lib/questions/answer.test.ts` (adicionar `area` na fixture)

**Interfaces:**
- Consumes: `Prova` existente
- Produces:
  - `Prova.area: string`
  - `ProvaListFilters { area?: string }`
  - `ProvaRepository.listProvas(filters?: ProvaListFilters): Promise<Prova[]>`
  - `ProvaRepository.listAreas(): Promise<string[]>`

- [ ] **Step 1: Write the failing tests**

Criar `src/lib/questions/in-memory-repository.test.ts`:

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InMemoryProvaRepository } from "./in-memory-repository";
import type { Prova } from "./types";

function stubProva(partial: Partial<Prova> & Pick<Prova, "id" | "area">): Prova {
	return {
		titulo: "T",
		orgao: "O",
		cargo: "C",
		banca: "B",
		ano: 2024,
		edital: "E",
		questoes: [],
		...partial,
	};
}

const provas: Prova[] = [
	stubProva({ id: "bb", area: "Bancário", titulo: "BB" }),
	stubProva({ id: "caixa", area: "Bancário", titulo: "Caixa" }),
	stubProva({ id: "inss", area: "Previdência", titulo: "INSS" }),
	stubProva({
		id: "cnu",
		area: "Administração pública",
		titulo: "CNU",
	}),
];

describe("InMemoryProvaRepository listagem por área", () => {
	const repo = new InMemoryProvaRepository(provas);

	it("listProvas sem filtro retorna todas", async () => {
		const list = await repo.listProvas();
		assert.equal(list.length, 4);
	});

	it("listProvas com area filtra por match exato", async () => {
		const list = await repo.listProvas({ area: "Bancário" });
		assert.deepEqual(
			list.map((p) => p.id).sort(),
			["bb", "caixa"],
		);
	});

	it("listProvas com area inexistente retorna vazio", async () => {
		const list = await repo.listProvas({ area: "Militar" });
		assert.deepEqual(list, []);
	});

	it("listAreas retorna únicas ordenadas", async () => {
		const areas = await repo.listAreas();
		assert.deepEqual(areas, [
			"Administração pública",
			"Bancário",
			"Previdência",
		]);
	});
});
```

Em `answer.test.ts`, adicionar `area: "A"` na fixture `prova`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx tsx --test src/lib/questions/in-memory-repository.test.ts`

Expected: FAIL (método `listAreas` / assinatura de `listProvas` / `area` ausente)

- [ ] **Step 3: Implement types + repository**

Em `types.ts`:

```ts
export interface Prova {
	id: string;
	titulo: string;
	orgao: string;
	cargo: string;
	area: string;
	banca: string;
	ano: number;
	edital: string;
	questoes: Question[];
}

export interface ProvaListFilters {
	area?: string;
}

export interface ProvaRepository {
	listProvas(filters?: ProvaListFilters): Promise<Prova[]>;
	listAreas(): Promise<string[]>;
	getProvaById(provaId: string): Promise<Prova | null>;
	listQuestoes(provaId: string, filters?: QuestionFilters): Promise<Question[]>;
	getQuestao(provaId: string, questionId: string): Promise<Question | null>;
	getFilterOptions(provaId: string): Promise<QuestionFilterOptions>;
	getNextQuestionId(
		provaId: string,
		currentQuestionId: string,
		filters?: QuestionFilters,
	): Promise<string | null>;
}
```

Em `in-memory-repository.ts`:

```ts
async listProvas(filters?: ProvaListFilters): Promise<Prova[]> {
	if (!filters?.area) {
		return this.allProvas;
	}
	return this.allProvas.filter((prova) => prova.area === filters.area);
}

async listAreas(): Promise<string[]> {
	return [...new Set(this.allProvas.map((prova) => prova.area))].sort(
		(a, b) => a.localeCompare(b, "pt-BR"),
	);
}
```

Importar `ProvaListFilters` no repositório.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx tsx --test src/lib/questions/in-memory-repository.test.ts src/lib/questions/answer.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/questions/types.ts src/lib/questions/in-memory-repository.ts src/lib/questions/in-memory-repository.test.ts src/lib/questions/answer.test.ts
git commit -m "$(cat <<'EOF'
feat(questions): filtrar listagem de provas por área

EOF
)"
```

---

### Task 2: Dados — configs, JSONs, build e validate

**Files:**
- Modify: `src/data/lib/concursos/types.ts`
- Modify: `src/data/lib/concursos/bb-ac.ts`
- Modify: `src/data/lib/concursos/caixa-2024.ts`
- Modify: `src/data/lib/concursos/inss-2022.ts`
- Modify: `src/data/lib/concursos/cnu-2024-b8.ts`
- Modify: `src/data/lib/parsers/cesgranrio.test.ts`
- Modify: `src/data/lib/parsers/cebraspe.test.ts`
- Modify: `src/data/lib/build-prova.mts`
- Modify: `src/data/lib/validate-prova.mts`
- Modify: os 4 JSONs em `src/data/*.json` (apenas metadado `area`)

**Interfaces:**
- Consumes: `Prova.area` da Task 1
- Produces: configs e JSONs com `area` preenchida; build emite `area`; validate checa `area`

- [ ] **Step 1: Atualizar tipos e configs**

Em `ConcursoConfig.prova`, após `cargo`:

```ts
area: string;
```

Valores:

| Config | `area` |
|--------|--------|
| `bbAcA` | `"Bancário"` |
| `caixa2024` | `"Bancário"` |
| `inss2022` | `"Previdência"` |
| `cnu2024b8` | `"Administração pública"` |

Fixtures dos parsers: `area: "A"`.

- [ ] **Step 2: Emitir e validar no pipeline**

Em `build-prova.mts`, no objeto `prova`:

```ts
cargo: config.prova.cargo,
area: config.prova.area,
```

Em `validate-prova.mts`, após o check de `prova.id`:

```ts
if (prova.area !== config.prova.area) {
	errors.push(`prova.area=${prova.area}`);
}
```

- [ ] **Step 3: Inserir `area` nos JSONs publicados (sem rebuild completo)**

Rodar (cwd = raiz do repo):

```bash
node --input-type=module <<'EOF'
import fs from "node:fs";

const updates = [
  ["src/data/PROVA A - AGENTE COMERCIAL - GABARITO 1.json", "Bancário"],
  ["src/data/Caixa - 2024 - Tecnico Bancario Novo.json", "Bancário"],
  ["src/data/INSS - 2022 - Tecnico do Seguro Social.json", "Previdência"],
  ["src/data/CNU - 2024 - Bloco 8 Nivel Intermediario.json", "Administração pública"],
];

for (const [path, area] of updates) {
  const prova = JSON.parse(fs.readFileSync(path, "utf8"));
  if (typeof prova.area === "string" && prova.area === area) {
    console.log(`skip ${path}`);
    continue;
  }
  const { cargo, ...rest } = prova;
  const next = { ...rest };
  // Reordenar: manter cargo e inserir area logo após
  const ordered = {};
  for (const [k, v] of Object.entries(prova)) {
    ordered[k] = v;
    if (k === "cargo") ordered.area = area;
  }
  if (!("area" in ordered)) ordered.area = area;
  fs.writeFileSync(path, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(`ok ${path} → ${area}`);
}
EOF
```

Verificar com:

```bash
node -e 'for (const f of ["PROVA A - AGENTE COMERCIAL - GABARITO 1.json","Caixa - 2024 - Tecnico Bancario Novo.json","INSS - 2022 - Tecnico do Seguro Social.json","CNU - 2024 - Bloco 8 Nivel Intermediario.json"]) { const p=JSON.parse(require("fs").readFileSync("src/data/"+f,"utf8")); console.log(f, p.area); }'
```

Expected: Bancário, Bancário, Previdência, Administração pública

- [ ] **Step 4: Typecheck + testes de parsers**

Run:

```bash
npx tsc --noEmit
npx tsx --test src/data/lib/parsers/cesgranrio.test.ts src/data/lib/parsers/cebraspe.test.ts src/lib/questions/in-memory-repository.test.ts
```

Expected: PASS / tsc limpo

- [ ] **Step 5: Commit**

```bash
git add src/data/lib/concursos src/data/lib/parsers src/data/lib/build-prova.mts src/data/lib/validate-prova.mts \
  "src/data/PROVA A - AGENTE COMERCIAL - GABARITO 1.json" \
  "src/data/Caixa - 2024 - Tecnico Bancario Novo.json" \
  "src/data/INSS - 2022 - Tecnico do Seguro Social.json" \
  "src/data/CNU - 2024 - Bloco 8 Nivel Intermediario.json"
git commit -m "$(cat <<'EOF'
feat(data): adicionar área nas provas e no pipeline

EOF
)"
```

---

### Task 3: URL helpers da listagem

**Files:**
- Create: `src/lib/provas/list-url.ts`
- Create: `src/lib/provas/list-url.test.ts`

**Interfaces:**
- Consumes: nenhum (puro)
- Produces:
  - `buildProvasListHref(area?: string): string`
  - `parseProvasListSearchParams(query: { area?: string }): { area?: string }`

- [ ] **Step 1: Write failing tests**

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	buildProvasListHref,
	parseProvasListSearchParams,
} from "./list-url";

describe("provas list url", () => {
	it("buildProvasListHref sem area retorna /provas", () => {
		assert.equal(buildProvasListHref(), "/provas");
		assert.equal(buildProvasListHref(""), "/provas");
		assert.equal(buildProvasListHref(undefined), "/provas");
	});

	it("buildProvasListHref com area encodeia query", () => {
		assert.equal(
			buildProvasListHref("Bancário"),
			`/provas?${new URLSearchParams({ area: "Bancário" }).toString()}`,
		);
		assert.equal(
			buildProvasListHref("Administração pública"),
			`/provas?${new URLSearchParams({ area: "Administração pública" }).toString()}`,
		);
	});

	it("parseProvasListSearchParams ignora vazio", () => {
		assert.deepEqual(parseProvasListSearchParams({}), {});
		assert.deepEqual(parseProvasListSearchParams({ area: "" }), {});
		assert.deepEqual(parseProvasListSearchParams({ area: "   " }), {});
		assert.deepEqual(parseProvasListSearchParams({ area: "Bancário" }), {
			area: "Bancário",
		});
	});
});
```

- [ ] **Step 2: Run tests (expect fail)**

Run: `npx tsx --test src/lib/provas/list-url.test.ts`

Expected: FAIL (módulo ausente)

- [ ] **Step 3: Implement**

```ts
export function buildProvasListHref(area?: string): string {
	const basePath = "/provas";
	if (!area) {
		return basePath;
	}
	const params = new URLSearchParams({ area });
	return `${basePath}?${params.toString()}`;
}

export function parseProvasListSearchParams(query: {
	area?: string;
}): { area?: string } {
	const area =
		query.area && query.area.trim() !== "" ? query.area.trim() : undefined;
	return { area };
}
```

- [ ] **Step 4: Run tests (expect pass)**

Run: `npx tsx --test src/lib/provas/list-url.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/provas/list-url.ts src/lib/provas/list-url.test.ts
git commit -m "$(cat <<'EOF'
feat(provas): helpers de URL para filtro por área

EOF
)"
```

---

### Task 4: UI do filtro + página `/provas`

**Files:**
- Create: `src/components/provas/prova-list-filters.tsx`
- Modify: `src/app/provas/page.tsx`

**Interfaces:**
- Consumes: `buildProvasListHref`, `parseProvasListSearchParams`, `listProvas`, `listAreas`
- Produces: página filtrável com select e empty state

- [ ] **Step 1: Criar o componente client**

Espelhar `QuestionFiltersForm` em `src/components/provas/prova-list-filters.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { buildProvasListHref } from "@/lib/provas/list-url";

interface ProvaListFiltersProps {
	areas: string[];
	current: {
		area?: string;
	};
}

export function ProvaListFilters({ areas, current }: ProvaListFiltersProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function navigate(area: string) {
		startTransition(() => {
			router.push(buildProvasListHref(area || undefined));
		});
	}

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm lg:flex-row lg:items-end">
			<label className="flex flex-1 flex-col gap-1 text-sm">
				<span className="font-medium text-muted">Área</span>
				<select
					key={current.area ?? "todas"}
					name="area"
					defaultValue={current.area ?? ""}
					disabled={isPending}
					onChange={(event) => navigate(event.target.value)}
					className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
				>
					<option value="">Todas</option>
					{areas.map((area) => (
						<option key={area} value={area}>
							{area}
						</option>
					))}
				</select>
			</label>

			<button
				type="button"
				disabled={isPending || !current.area}
				onClick={() => navigate("")}
				className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-background disabled:opacity-50"
			>
				Limpar
			</button>
		</div>
	);
}
```

- [ ] **Step 2: Atualizar `src/app/provas/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ProvaListFilters } from "@/components/provas/prova-list-filters";
import { parseProvasListSearchParams } from "@/lib/provas/list-url";
import { getProvaRepository } from "@/lib/questions";

export const metadata: Metadata = {
	title: "Provas",
};

interface ProvasPageProps {
	searchParams: Promise<{ area?: string }>;
}

export default async function ProvasPage({ searchParams }: ProvasPageProps) {
	const { area } = parseProvasListSearchParams(await searchParams);
	const repository = getProvaRepository();
	const [areas, provas] = await Promise.all([
		repository.listAreas(),
		repository.listProvas({ area }),
	]);

	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
					Provas
				</h1>
				<p className="max-w-2xl text-sm text-muted sm:text-base">
					Escolha uma prova para treinar questão a questão, com filtro por
					disciplina e histórico local.
				</p>
			</header>

			<ProvaListFilters areas={areas} current={{ area }} />

			{provas.length === 0 ? (
				<p className="text-sm text-muted">
					Nenhuma prova nesta área. Limpe o filtro para ver todas.
				</p>
			) : (
				<ul className="flex flex-col gap-4">
					{provas.map((prova) => (
						<li key={prova.id}>
							<Link
								href={`/provas/${prova.id}`}
								className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
							>
								<h2 className="font-display text-xl font-semibold text-foreground">
									{prova.titulo}
								</h2>
								<p className="mt-2 text-sm text-muted">
									{prova.orgao} · {prova.cargo} · {prova.area}
								</p>
								<p className="mt-1 text-sm text-muted">
									{prova.banca} · {prova.ano} · {prova.edital}
								</p>
								<p className="mt-4 text-sm font-semibold text-accent">
									{prova.questoes.length} questões →
								</p>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
```

- [ ] **Step 3: Verificar**

Run:

```bash
npx tsc --noEmit
npx biome check src/components/provas/prova-list-filters.tsx src/app/provas/page.tsx src/lib/provas/list-url.ts
npx tsx --test src/lib/provas/list-url.test.ts src/lib/questions/in-memory-repository.test.ts
```

Expected: tsc limpo, biome ok, testes PASS

Check manual: `npm run dev` → `/provas`, `/provas?area=Bancário` (só BB+Caixa), área inventada → empty state.

- [ ] **Step 4: Commit**

```bash
git add src/components/provas/prova-list-filters.tsx src/app/provas/page.tsx
git commit -m "$(cat <<'EOF'
feat(provas): filtrar listagem por área na UI

EOF
)"
```

---

## Spec coverage checklist

| Requisito | Task |
|-----------|------|
| `area` no modelo `Prova` | 1 |
| `area` em configs + JSONs | 2 |
| build emite `area` | 2 |
| Select Área + Todas + Limpar | 4 |
| URL `?area=` | 3, 4 |
| Server filtra via repo | 1, 4 |
| Áreas BB/Caixa/INSS/CNU | 2 |
| Empty state sem 404 | 4 |
| Área no card | 4 |
| `listAreas` ordenado | 1 |
| Testes filtro / Todas / inexistente | 1 |
| Fixtures com `area` | 1, 2 |
| Fora de escopo (cargo, multi, disciplina) | não tocado |

## Self-review notes

- Sem placeholders TBD/TODO.
- Assinaturas alinhadas entre tasks (`listProvas(filters?)`, `listAreas()`, `buildProvasListHref`).
- JSONs atualizados in-place para não depender de PDFs/`raw.txt` no ambiente do agent.
