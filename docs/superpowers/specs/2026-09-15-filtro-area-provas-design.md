# Filtro por área em `/provas` — Design Spec

Data: 2026-09-15  
Status: aprovado em conversa; aguardando revisão do arquivo

## Contexto

A listagem em `/provas` mostra todas as provas sem filtro. O campo `cargo` existe, mas cargos próximos (ex.: Técnico Bancário Novo e Agente Comercial) não devem ser tratados como categorias distintas. O usuário quer filtrar por **área** de carreira.

## Objetivos

- Permitir filtrar a listagem de provas por uma área por vez.
- Persistir a escolha na URL (`?area=`).
- Agrupar provas parecidas sob o mesmo rótulo de área.
- Manter `cargo` apenas como metadado de exibição.

## Não objetivos

- Filtro por cargo.
- Multi-seleção de áreas.
- Alterar o filtro por disciplina na página da prova.
- Banco de dados ou API nova (dados continuam estáticos).

## Decisões

| Decisão | Escolha |
|---------|---------|
| Modelo | Campo `area: string` em cada prova |
| UI | Select “Área” + “Todas” + “Limpar” |
| URL | `/provas?area=Bancário` |
| Padrão de implementação | Espelhar o filtro de disciplina |
| Áreas iniciais | Ver tabela abaixo |

## Áreas iniciais

| Prova | Área |
|-------|------|
| BB Agente Comercial | Bancário |
| Caixa Técnico Bancário Novo | Bancário |
| INSS Técnico do Seguro Social | Previdência |
| CNU Bloco 8 | Administração pública |

## Dados

- Adicionar `area: string` em:
  - `Prova` (`src/lib/questions/types.ts`)
  - `ConcursoConfig.prova` (`src/data/lib/concursos/types.ts`)
- Preencher `area` nos configs dos concursos e nos JSONs publicados.
- `build-prova.mts` passa a emitir `area` nos metadados da prova gerada.
- Fixtures/testes que montam `Prova` ou `ConcursoConfig` passam a incluir `area`.

## UI e fluxo

1. Em `/provas`, acima da lista, um select “Área” no estilo de `QuestionFiltersForm`.
2. Opções = áreas distintas de `listProvas()`, ordenadas alfabeticamente, mais “Todas”.
3. Ao mudar o select, navega para `/provas?area=...` ou `/provas` (sem param).
4. Botão “Limpar” remove o filtro (desabilitado quando não há área ativa).
5. Server Component lê `searchParams.area` e filtra antes de renderizar.
6. Cards continuam mostrando `cargo`; passam a mostrar também `area` (ex.: `orgão · cargo · área`).
7. Lista vazia (área sem provas ou valor inválido na URL): mensagem curta pedindo para limpar o filtro. Sem 404.

## Repositório

- `listProvas(filters?: { area?: string }): Promise<Prova[]>`
  - Sem filtro: todas as provas.
  - Com `area`: apenas provas com `prova.area === area` (match exato).
- Método para opções do select, ex.: `listAreas(): Promise<string[]>` (únicas, ordenadas).
- `getProvaById` e demais métodos de questões permanecem iguais.

## Arquivos principais

| Arquivo | Mudança |
|---------|---------|
| `src/lib/questions/types.ts` | `area` em `Prova`; filtros/opções de listagem |
| `src/lib/questions/in-memory-repository.ts` | filtro + `listAreas` |
| `src/data/lib/concursos/types.ts` + configs | `area` no build |
| `src/data/lib/build-prova.mts` | emitir `area` |
| JSONs em `src/data/*.json` | campo `area` nos metadados |
| `src/app/provas/page.tsx` | `searchParams` + lista filtrada |
| Novo componente de filtro (ex. `prova-list-filters.tsx`) | select client |
| Helpers de URL de listagem (opcional, espelhando `lib/provas/url.ts`) | `?area=` |

## Critérios de pronto

- `/provas` sem query mostra todas as provas.
- `/provas?area=Bancário` mostra só BB e Caixa.
- Select lista Bancário, Previdência e Administração pública.
- “Limpar” e “Todas” voltam à listagem completa.
- Área inválida na URL → lista vazia + mensagem, sem erro.
- Tipos, configs, JSONs e fixtures de teste incluem `area`.
- Testes cobrem filtro, “Todas” e área inexistente.
