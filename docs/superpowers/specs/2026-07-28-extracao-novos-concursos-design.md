# Extração de novos concursos — Design Spec

Data: 2026-07-28  
Status: aprovado em conversa; aguardando revisão do arquivo

## Contexto

O pipeline em `src/data/lib` hoje serve só à Cesgranrio BB Agente Comercial (provas A/B/C, 70 questões A–E). Foram adicionados PDFs em `src/data/raw` de Caixa 2024, CNU 2024 Bloco 8, INSS 2022 e TRT7 2024. A app consome `src/data/*.json` via `provas.ts`.

## Objetivos

- Extrair e publicar JSONs de **Caixa**, **CNU Bloco 8** e **INSS** no mesmo padrão editorial das provas BB.
- Generalizar `data/lib` com configs por concurso e parsers por banca (Cesgranrio A–E e Cebraspe C/E).
- Estender o schema com `tipo` e adaptar a UI para Certo/Errado e itens anulados.
- Registrar os três novos JSONs em `provas.ts`.

## Não objetivos

- TRT7 2024 (PDF sem texto / só imagem; OCR fora desta entrega).
- Outros blocos ou turnos do CNU além do Bloco 8 manhã Gabarito 1.
- Redesign amplo do player além do necessário para C/E e anulados.
- Manter scripts hardcode só para BB como caminho feliz (BB vira um config entre outros).

## Decisões

| Decisão | Escolha |
|---------|---------|
| Escopo | Caixa + CNU + INSS (sem TRT7) |
| Modelagem C/E | Schema com `tipo: "multipla" \| "certo_errado"` + UI |
| Qualidade | Padrão editorial BB (textos de apoio, limpeza fina) |
| Organização JSON | Um arquivo por concurso; INSS mescla básico + específico |
| Cadastro na app | Registrar todos em `provas.ts` |
| Abordagem | Pipeline genérico por banca/config |
| Gabarito | Gabarito 1 quando houver múltiplos (Caixa, CNU) |
| Anulados INSS | Incluir questão com `gabaritoId: "x"` |

## Schema

### `Question`

Campo novo:

```ts
tipo: "multipla" | "certo_errado"
```

- **`multipla`**: 5 alternativas `a`–`e` (BB, Caixa, CNU).
- **`certo_errado`**: exatamente `{ id: "c", texto: "Certo" }` e `{ id: "e", texto: "Errado" }`; `gabaritoId` é `"c"`, `"e"` ou `"x"` (anulado).

Provas BB existentes: migrar com `tipo: "multipla"` em todas as questões. Leitura pode tratar ausência como `multipla` para compatibilidade.

### Arquivos de saída

| Arquivo | Conteúdo |
|---------|----------|
| `Caixa - 2024 - Tecnico Bancario Novo.json` | 60 Qs A–E, Gabarito 1 |
| `CNU - 2024 - Bloco 8 Nivel Intermediario.json` | 15 Qs Português manhã, Gabarito 1 |
| `INSS - 2022 - Tecnico do Seguro Social.json` | Básico + Específico mesclados, C/E, números oficiais |

Metadados de cada `Prova` (`id`, `titulo`, `orgao`, `cargo`, `banca`, `ano`, `edital`) vêm do config do concurso.

## Pipeline (`src/data/lib`)

### Configs

Um módulo por concurso em `src/data/lib/concursos/`, com:

- Metadados da prova
- Paths relativos em `raw/` (um ou mais PDFs de prova + gabarito)
- Mapa de disciplinas por faixa de número
- `parser`: `cesgranrio` \| `cebraspe`
- Número do gabarito (padrão 1)
- Regras de ruído de página / marcadores de gabarito

BB A/B/C passam a ser configs equivalentes (sem regressão).

### Comandos

1. `extract-pdf.mts <slug>` — resolve PDF(s) pelo config; gera `artefacts/<slug>/raw.txt` + imagens.
2. `build-prova.mts <slug>` (novo) — parse do raw + gabarito → JSON em `src/data/`, anexando textos de apoio às questões do bloco quando detectáveis.
3. `validate-prova.mts <slug>` — contagem, ids, disciplinas, gabarito, regras por `tipo` (5 alts vs 2 C/E; anulado `x`).
4. `fix-prova.mts` — correções pontuais; deixa de ser hardcode BB.

### Parsers

**Cesgranrio** (Caixa, CNU, BB):

- Número acima do enunciado + alternativas `(A)`…`(E)`.
- Strip de cabeçalhos/rodapés.
- Texto de apoio do bloco repetido no enunciado das questões (padrão BB).

**Cebraspe** (INSS):

- Itens numerados julgados C/E.
- Enunciado = texto-base do bloco + enunciado do item.
- Alternativas fixas Certo/Errado.
- Mesclar cadernos básico e específico no mesmo JSON preservando numeração oficial.
- Gabarito com `C`, `E` ou `X` → `c` / `e` / `x`.

## UI

- `QuestionResolver`: se `tipo === "certo_errado"`, renderiza só as 2 opções.
- Hotkeys: só opções existentes respondem (`c`/`e` no C/E; `a`–`e` na múltipla).
- Acerto: continua `selectedId === gabaritoId`.
- **Anulado (`gabaritoId: "x"`):** não conta como acerto nem erro; feedback “Item anulado”; ainda listável/filtrável por disciplina.
- Figuras: placeholders no raw; no JSON final remover leftovers `$$ IMAGE N $$` (revisão manual se alguma questão depender de figura).

## Qualidade e erros

- Validação falha se faltar questão, gabarito, disciplina ou alternativa.
- Limpeza de vazamentos entre alternativas e ruído de página.
- Meta: mesmo nível editorial das provas BB atuais; polimento residual permitido via revisão sobre `raw.txt` / JSON, como já documentado no README do lib.

## Fora / riscos

- Layouts PDF heterogêneos (colunas Cesgranrio, cookies Cebraspe) podem exigir ajustes finos por concurso após o primeiro extract.
- CNU gabarito PDF contém vários blocos; o parser deve isolar **BLOCO 8 … GABARITO 1**.
- Caixa tem 60 questões e disciplinas distintas do BB; mapa no config é obrigatório.

## Critérios de aceite

1. Três JSONs novos no formato `Prova`, com `tipo` correto em cada questão.
2. BB existentes validam sem regressão (com `tipo: "multipla"`).
3. `provas.ts` lista as três novas provas.
4. UI resolve C/E e mostra “Item anulado” quando `gabaritoId === "x"`.
5. `validate-prova` passa para os slugs Caixa, CNU e INSS (gabarito alinhado ao PDF oficial Gabarito 1 / definitivo).
6. README de `data/lib` atualizado com os novos comandos/slugs.
