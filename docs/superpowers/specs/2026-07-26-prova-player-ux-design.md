# Prova Player UX — Design Spec

Data: 2026-07-26  
Status: aprovado em conversa; aguardando revisão do arquivo

## Contexto

O `ProvaPlayer` permite treinar questões de concurso com gabarito imediato. A base funciona, mas a sessão ainda parece formulário: mapa de progresso incompleto, questão abaixo da dobra no mobile, ações sem hierarquia e ausência de fechamento ao terminar a lista.

## Objetivos

- Tornar o estado de cada questão legível no mapa (pendente / erro / acerto / atual).
- Colocar enunciado e alternativas no centro da experiência, sobretudo no mobile.
- Clarificar ações de treino e oferecer fechamento útil ao fim da lista filtrada.
- Polir atalhos, scroll, alvos de toque e feedback, sem mudar o modelo de produto.

## Não objetivos

- Modo simulado (responder tudo e corrigir só no fim).
- Comentários pedagógicos ou explicações de gabarito inventadas.
- Timer, bloqueio de “próxima” sem responder.
- Sync em nuvem, redesign da home ou do histórico além do link de CTA.
- Mudança de stack ou redesign visual completo do design system.

## Decisões de produto

| Decisão | Escolha |
|---------|---------|
| Fatia de entrega | Por valor de sessão (4 etapas sequenciais) |
| Modo | Apenas treino com gabarito imediato |
| Pular questão | Permitido (treino livre) |
| Persistência | Continua no histórico local existente |

## Arquitetura

### Superfícies

| Área | Arquivos principais |
|------|---------------------|
| Estado do player | `src/hooks/use-prova-player.ts` |
| Progresso | `src/lib/history/progress.ts` (+ store existente) |
| Grade / chrome | `src/components/questions/prova-player.tsx` |
| Questão / ações | `src/components/questions/question-resolver.tsx` |
| Estilos de status | `src/lib/ui/question-styles.ts` |
| Rótulos | `src/lib/ui/labels.ts` |
| Página | `src/app/provas/[provaId]/page.tsx` (hierarquia `h1`, filtro fora do sticky) |

### Modelo de status da célula

Derivado de `answeredIds` e `correctIds` (já carregados do store):

| Status | Regra |
|--------|-------|
| `correct` | `questionId` ∈ `correctIds` |
| `wrong` | ∈ `answeredIds` e ∉ `correctIds` |
| `pending` | fora de ambos |
| `active` | overlay visual (`aria-current`); não substitui a cor de fundo do status |

Contador sugerido: `12/70 · 8 acertos · 4 erros` (via helper em `labels.ts`).

### Fluxo de dados

```
store (attempts)
  → loadAnsweredIds / loadCorrectIds
  → useProvaPlayer (activeId, markAnswered, prev/next)
  → ProvaPlayer (chrome, mapa, conclusão)
  → QuestionResolver (seleção, conferir, revelar)
```

`markAnswered(questionId, correct)` continua atualizando sets locais após `registerQuestionAttempt`.

## Etapa 1 — Mapa de progresso

### UI

- Grade colorida por status (`pending` / `wrong` / `correct`) + anel na ativa.
- Contador com totais de respondidas, acertos e erros.
- Legenda curta (texto + cor): Pendente · Erro · Acerto · Atual.

### Código

- Estender `questionNavCellClass` (ou equivalente) para receber status + `isActive`.
- Atualizar `answeredCountLabel` ou criar label dedicado ao resumo da sessão.
- Sem mudança de schema do store nesta etapa.

### Critério de pronto

- Questão só errada aparece distinta de nunca respondida.
- Questão acertada permanece verde mesmo se for a ativa (anel + fundo success).

## Etapa 2 — Layout (questão no centro)

### Composição

1. **Chrome sticky da sessão** (dentro do player): `Questão N de T`, barra de progresso fina, resumo `8✓ 4✗`. Não repetir título/banca/ano da página.
2. **QuestionResolver primeiro** no fluxo visual principal.
3. **Mapa da prova:**
   - até `md`: colapsado por padrão (“Mapa da prova”); ao selecionar questão, recolhe.
   - a partir de `lg`: sempre visível (coluna estreita ou bloco compacto acima), células ~44px.
4. **Filtro de disciplina:** permanece na página, acima do player, fora do sticky; `flex-col` até `lg`.
5. **Chips do card:** manter disciplina (útil com filtro “Todas”); remover banca, ano e “Questão N” duplicados.
6. **Hierarquia:** enunciado deixa de ser segundo `h1` da página (usar `h2` ou heading adequado).
7. **Scroll:** ao mudar questão, `scrollIntoView` suave no chrome sticky / artigo.

### Critério de pronto

- No viewport mobile (~375px), enunciado ou alternativas entram na primeira tela sem abrir o mapa.
- Mapa acessível sob demanda no mobile; sempre visível em `lg+`.

## Etapa 3 — Ações e fim de prova

### Hierarquia de botões

| Estado | Primária | Secundária | Terciária |
|--------|----------|------------|-----------|
| Antes de conferir | Conferir (disabled sem seleção) | Próxima | Anterior |
| Depois de revelar | Próxima (ou CTA de resultado na última) | Tentar de novo | Anterior |

Estilos: primária `bg-accent`; secundária soft/outline.

### Navegação

- `findPreviousQuestion` espelhando `findNextQuestion` (lista filtrada atual).
- “Próxima” pode pular sem responder.

### Feedback pós-conferir

- Manter gabarito imediato e cores nas alternativas.
- Texto: título + `Sua resposta: X · Gabarito: Y`.

### Painel de conclusão

Aparece quando `!nextQuestion` **e** (acabou de revelar **ou** todas as questões do filtro ∈ `answeredIds`).

Conteúdo:

- `X acertos · Y erros · Z pendentes` · taxa %
- CTAs:
  - **Revisar erros** → primeira questão `wrong`, se houver
  - **Ver histórico** → `/historico`
  - **Continuar pendentes** → primeira `pending`, se houver

### Critério de pronto

- Só um botão filled compete como primário em cada estado.
- Na última questão da lista, há fechamento com CTAs acionáveis.

## Etapa 4 — Polimento

### Atalhos

Ativos com foco na sessão; ignorar se o foco estiver em `<select>`, input ou conteúdo editável:

| Tecla | Ação |
|-------|------|
| `A`–`E` | Selecionar alternativa (se não revelou) |
| `Enter` | Conferir |
| `←` / `→` | Anterior / Próxima |

### Hidratação

- Evitar flash “Carregando progresso...”: inicializar `activeId` com a primeira questão da lista e reconciliar progresso no efeito (ou padrão equivalente sem esvaziar a UI).

### A11y e toque

- Células do mapa ≥ ~44px no mobile.
- Legenda não depende só de cor.
- `aria-current` na ativa; resumo com `aria-live` educado (polite).

### “Tentar de novo”

- Limpa seleção/revelação na UI; tentativas no store permanecem.

### Critério de pronto

- Atalhos não disparam com foco no select de disciplina.
- Remount da página não mostra estado vazio de loading da questão.

## Ordem de entrega

1. Mapa de progresso  
2. Layout mobile/foco  
3. Ações + fim de prova  
4. Polimento  

Cada etapa é utilizável isoladamente e preferencialmente um PR.

## Testes mínimos

| Etapa | Cobertura |
|-------|-----------|
| 1 | Derivação de status + labels do contador |
| 2 | Ordem/colapso do mapa (teste de componente ou assert de estrutura) |
| 3 | Anterior/próxima + condição do painel + “Revisar erros” |
| 4 | Handler de teclado ignora foco em select; hidratação sem null flash |

## Riscos

| Risco | Mitigação |
|-------|-----------|
| `correctIds` reflete “já acertou alguma vez”, não só a última tentativa | Documentar na UI como “já acertou”; não inventar last-attempt sem mudar o store |
| Filtro por disciplina remonta o player | Manter `key` atual; conclusão e mapa usam só a lista filtrada |
| Sticky + teclado em mobile | Atalhos são enhancement; botões continuam suficientes |

## Fora desta revisão de spec

Implementação, plan file detalhado tarefa a tarefa e commits de código. Após aprovação deste arquivo, segue `writing-plans`.
