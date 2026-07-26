# Prova Player UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o UX do prova-player em quatro etapas sequenciais (mapa → layout → ações/fim → polimento), só no modo treino com gabarito imediato.

**Architecture:** Funções puras de status/labels/navegação em `src/lib`; hooks orquestram sets e `activeId`; `ProvaPlayer` compõe chrome sticky, mapa e conclusão; `QuestionResolver` cuida de alternativas e hierarquia de botões. Persistência continua no store local de attempts.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, Tailwind 4, Biome. Testes unitários com `node:test` + `tsx` (sem runner novo).

## Global Constraints

- Sem modo simulado, timer ou bloqueio de “próxima” sem responder
- Sem inventar comentários de gabarito
- Mobile-first: layouts horizontais só a partir de `lg`
- Zero `any`; textos em português brasileiro; sem em/en dashes
- Commits Conventional Commits em PT quando o usuário pedir commit (neste plano, commitar ao fim de cada task)
- Spec: `docs/superpowers/specs/2026-07-26-prova-player-ux-design.md`

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/ui/question-status.ts` | `QuestionNavStatus`, `resolveQuestionNavStatus` |
| `src/lib/ui/labels.ts` | `sessionProgressLabel`, `sessionCompactLabel` |
| `src/lib/ui/question-styles.ts` | `questionNavCellClass(status, isActive)` |
| `src/lib/history/progress.ts` | `findPreviousQuestion`, helpers de conclusão |
| `src/hooks/use-prova-player.ts` | prev/next, hidratação sem flash, counts |
| `src/components/questions/prova-player.tsx` | chrome, mapa, legenda, conclusão |
| `src/components/questions/question-resolver.tsx` | chips, headings, botões, feedback, atalhos |
| `src/lib/ui/*.test.ts` | testes node:test |

---

### Task 1: Status do mapa + labels + estilos

**Files:**
- Create: `src/lib/ui/question-status.ts`
- Create: `src/lib/ui/question-status.test.ts`
- Create: `src/lib/ui/labels.test.ts`
- Modify: `src/lib/ui/labels.ts`
- Modify: `src/lib/ui/question-styles.ts`
- Modify: `src/components/questions/prova-player.tsx`
- Create: `src/lib/ui/question-styles.test.ts`

**Interfaces:**
- Produces: `type QuestionNavStatus = "pending" | "wrong" | "correct"`
- Produces: `resolveQuestionNavStatus(questionId, answeredIds, correctIds): QuestionNavStatus`
- Produces: `sessionProgressLabel({ total, correct, wrong }): string` → `"12/70 · 8 acertos · 4 erros"` (ajustar plural)
- Produces: `questionNavCellClass(status: QuestionNavStatus, isActive: boolean): string`

- [ ] **Step 1: Write failing tests for status + label + cell class**

```ts
// src/lib/ui/question-status.test.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveQuestionNavStatus } from "./question-status.ts";

describe("resolveQuestionNavStatus", () => {
	it("pending when never answered", () => {
		assert.equal(
			resolveQuestionNavStatus("q1", new Set(), new Set()),
			"pending",
		);
	});
	it("wrong when answered but not correct", () => {
		assert.equal(
			resolveQuestionNavStatus("q1", new Set(["q1"]), new Set()),
			"wrong",
		);
	});
	it("correct when in correctIds", () => {
		assert.equal(
			resolveQuestionNavStatus("q1", new Set(["q1"]), new Set(["q1"]),
			),
			"correct",
		);
	});
});
```

```ts
// src/lib/ui/labels.test.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sessionProgressLabel } from "./labels.ts";

describe("sessionProgressLabel", () => {
	it("formats totals", () => {
		assert.equal(
			sessionProgressLabel({ total: 70, correct: 8, wrong: 4 }),
			"12/70 · 8 acertos · 4 erros",
		);
	});
	it("singular forms", () => {
		assert.equal(
			sessionProgressLabel({ total: 1, correct: 1, wrong: 0 }),
			"1/1 · 1 acerto · 0 erros",
		);
	});
});
```

```ts
// src/lib/ui/question-styles.test.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { questionNavCellClass } from "./question-styles.ts";

describe("questionNavCellClass", () => {
	it("wrong differs from pending", () => {
		const pending = questionNavCellClass("pending", false);
		const wrong = questionNavCellClass("wrong", false);
		assert.notEqual(pending, wrong);
		assert.match(wrong, /danger|success|accent|border/);
		assert.match(wrong, /danger/);
	});
	it("active correct keeps success and adds ring", () => {
		const cls = questionNavCellClass("correct", true);
		assert.match(cls, /success/);
		assert.match(cls, /ring/);
	});
});
```

- [ ] **Step 2: Run tests (expect fail)**

Run: `cd /home/andre/Projetos/libreConcursos && npx tsx --test src/lib/ui/question-status.test.ts src/lib/ui/labels.test.ts src/lib/ui/question-styles.test.ts`

Expected: FAIL (module/export missing)

- [ ] **Step 3: Implement status, labels, styles**

```ts
// src/lib/ui/question-status.ts
export type QuestionNavStatus = "pending" | "wrong" | "correct";

export function resolveQuestionNavStatus(
	questionId: string,
	answeredIds: ReadonlySet<string>,
	correctIds: ReadonlySet<string>,
): QuestionNavStatus {
	if (correctIds.has(questionId)) return "correct";
	if (answeredIds.has(questionId)) return "wrong";
	return "pending";
}
```

Em `labels.ts` adicionar:

```ts
export function sessionProgressLabel(input: {
	total: number;
	correct: number;
	wrong: number;
}): string {
	const answered = input.correct + input.wrong;
	const acerto = input.correct === 1 ? "acerto" : "acertos";
	const erro = input.wrong === 1 ? "erro" : "erros";
	return `${answered}/${input.total} · ${input.correct} ${acerto} · ${input.wrong} ${erro}`;
}

export function sessionCompactLabel(correct: number, wrong: number): string {
	return `${correct}✓ ${wrong}✗`;
}
```

Substituir `questionNavCellClass` por assinatura nova (atualizar call site no player):

```ts
export function questionNavCellClass(
	status: QuestionNavStatus,
	isActive: boolean,
): string {
	const ring = isActive ? " ring-2 ring-accent/40" : "";
	if (status === "correct") {
		return `border-success bg-success text-white${isActive ? " ring-2 ring-success/40" : ""}${status === "correct" && !isActive ? " hover:border-success hover:bg-success" : ""}`;
	}
	if (status === "wrong") {
		return `border-danger bg-danger text-white${isActive ? " ring-2 ring-danger/40" : " hover:border-danger hover:bg-danger"}`;
	}
	if (isActive) {
		return "border-accent bg-accent text-white ring-2 ring-accent/30";
	}
	return "border-border bg-surface text-muted hover:border-accent/40 hover:text-accent-strong";
}
```

(Simplificar a implementação real para classes limpas sem ternários confusos; manter pending/wrong/correct + active ring.)

Wire em `prova-player.tsx`: usar `resolveQuestionNavStatus`, `sessionProgressLabel`, nova `questionNavCellClass`; legenda Pendente · Erro · Acerto · Atual.

- [ ] **Step 4: Re-run tests (expect pass)**

Run: `npx tsx --test src/lib/ui/question-status.test.ts src/lib/ui/labels.test.ts src/lib/ui/question-styles.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/ui/question-status.ts src/lib/ui/question-status.test.ts src/lib/ui/labels.ts src/lib/ui/labels.test.ts src/lib/ui/question-styles.ts src/lib/ui/question-styles.test.ts src/components/questions/prova-player.tsx
git commit -m "$(cat <<'EOF'
feat(prova-player): mapa com status pendente, erro e acerto

EOF
)"
```

---

### Task 2: Layout questão no centro + mapa colapsável

**Files:**
- Modify: `src/components/questions/prova-player.tsx`
- Modify: `src/components/questions/question-resolver.tsx`

**Interfaces:**
- Consumes: `sessionProgressLabel`, `sessionCompactLabel`, status helpers da Task 1
- Produces: chrome sticky com `data-prova-chrome`; mapa `<details>`/`<summary>` até `lg`, aberto em `lg+`

- [ ] **Step 1: Reestruturar ProvaPlayer**

Ordem DOM:
1. `<div ref/chrome sticky>` com `Questão {numero} de {total}`, barra `width: (answered/total)*100%`, `sessionCompactLabel`
2. `<QuestionResolver ... />`
3. Mapa: em mobile `details` fechado por padrão; classe `lg:open` não existe nativamente — usar estado `mapOpen` default `false` + `useEffect`/`matchMedia('(min-width: 1024px)')` para forçar aberto em lg, OU dois blocos (hidden lg:block / lg:hidden). Preferir **dois blocos** para evitar hidratação tricky: `nav` sempre visível `hidden lg:block`; `details` `lg:hidden` colapsado; ao clicar célula no `details`, `details.open = false` via ref/state.

Células: `min-h-11` (~44px). `aria-live="polite"` no resumo.

Scroll: `useEffect` on `activeQuestion.id` → `chromeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })`.

- [ ] **Step 2: Slim chips + heading no QuestionResolver**

- Remover chips banca, ano, “Questão N”
- Manter disciplina
- Trocar `<h1>` do enunciado por `<h2 className="... text-lg sm:text-xl">`

- [ ] **Step 3: Verificar build**

Run: `npx tsc --noEmit` e `npm run lint` nos arquivos tocados (ou `biome check` paths)

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(prova-player): questão no centro e mapa colapsável no mobile

EOF
)"
```

---

### Task 3: Anterior/Próxima, hierarquia de ações, feedback

**Files:**
- Modify: `src/lib/history/progress.ts`
- Create: `src/lib/history/progress.test.ts`
- Modify: `src/hooks/use-prova-player.ts`
- Modify: `src/components/questions/question-resolver.tsx`
- Modify: `src/components/questions/prova-player.tsx`

**Interfaces:**
- Produces: `findPreviousQuestion(questions, currentId): Question | null`
- Produces: props `onPrevious: (() => void) | null` em `QuestionResolver`
- Hook retorna `previousQuestion` além de `nextQuestion`

- [ ] **Step 1: Test + implement findPreviousQuestion**

```ts
it("returns previous or null", () => {
	const qs = [
		{ id: "a" },
		{ id: "b" },
		{ id: "c" },
	] as Question[];
	assert.equal(findPreviousQuestion(qs, "b")?.id, "a");
	assert.equal(findPreviousQuestion(qs, "a"), null);
});
```

- [ ] **Step 2: Wire hook + resolver buttons**

Antes de revelar: primária Conferir; secundária Próxima (soft); terciária Anterior (outline).
Depois: primária Próxima (ou omitida se null); secundária Tentar de novo; terciária Anterior.

Feedback:

```tsx
<p className="font-semibold">{isCorrect ? "Resposta correta" : "Resposta incorreta"}</p>
<p className="mt-1 text-sm">
	Sua resposta: <strong className="uppercase">{selectedId}</strong>
	{" · "}
	Gabarito: <strong className="uppercase">{question.gabaritoId}</strong>
</p>
```

- [ ] **Step 3: Run progress tests + tsc**

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(prova-player): navegação anterior/próxima e hierarquia de ações

EOF
)"
```

---

### Task 4: Painel de conclusão

**Files:**
- Create: `src/lib/ui/session-summary.ts` (puro)
- Create: `src/lib/ui/session-summary.test.ts`
- Modify: `src/components/questions/prova-player.tsx`
- Modify: `src/components/questions/question-resolver.tsx` (callback `onRevealed` ou prop `showCompletionCta`)

**Interfaces:**
- Produces: `shouldShowCompletion({ hasNext, justRevealed, allAnswered }): boolean`
- Produces: `firstQuestionWithStatus(questions, status, answeredIds, correctIds): Question | null`
- Player state: `justFinished` set when last question reveals via `onAnswered` when `!nextQuestion`

Regra: mostrar painel quando `!nextQuestion && (justFinished || allAnswered)`.

CTAs:
- Revisar erros → `setActiveId` primeira wrong
- Link Ver histórico → `/historico`
- Continuar pendentes → primeira pending

Taxa: `correct / max(answered, 1) * 100` arredondado, ou `correct/total` — usar answered como denominador da taxa da sessão filtrada: `Math.round((correct / answered) * 100)` se answered > 0, senão `0`.

- [ ] **Step 1: Tests for shouldShowCompletion + first wrong/pending**

- [ ] **Step 2: UI painel no ProvaPlayer** (abaixo do resolver ou no lugar da primária “próxima”)

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(prova-player): painel de conclusão com revisar erros e pendentes

EOF
)"
```

---

### Task 5: Polimento (atalhos, hidratação, a11y)

**Files:**
- Modify: `src/hooks/use-prova-player.ts`
- Modify: `src/components/questions/question-resolver.tsx`
- Create: `src/lib/ui/session-hotkeys.ts` + test (pure: given key + context → action enum)
- Modify: `src/components/questions/prova-player.tsx` (targets já 44px da Task 2)

**Interfaces:**
- Produces: `resolveSessionHotkey(eventLike): "select-a" | ... | "conferir" | "prev" | "next" | null`
- Ignorar se `target` é select/input/textarea/contenteditable

Hidratação:

```ts
const [activeId, setActiveId] = useState<string | null>(
	() => questions[0]?.id ?? null,
);
```

No effect, reconciliar com `resolveInitialQuestionId` sem setar `null` intermediário.

Atalhos: `useEffect` keydown no resolver ou player document-level com guard.

- [ ] **Step 1: Hotkey pure tests + impl**

- [ ] **Step 2: Wire + hydration**

- [ ] **Step 3: Full verify**

Run: `npx tsx --test src/lib/ui/*.test.ts src/lib/history/progress.test.ts` && `npx tsc --noEmit` && `npm run lint`

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(prova-player): atalhos de teclado e hidratação sem flash

EOF
)"
```

---

## Self-review checklist

- Spec etapas 1–4 cobertas pelas Tasks 1–5
- Sem modo simulado
- Nomes estáveis: `QuestionNavStatus`, `sessionProgressLabel`, `findPreviousQuestion`, `shouldShowCompletion`
- Testes com `npx tsx --test` e imports relativos `.ts`
