# Pipeline de provas

## Layout

- `src/data/raw/` — PDFs fonte (provas + gabaritos)
- `src/data/*.json` — JSON consumido pela app
- `src/data/lib/artefacts/` — intermediários (`raw.txt`, imagens); gitignored
- `src/data/lib/concursos/` — configs por slug

## Slugs

| Slug | Concurso |
|------|----------|
| `bb-ac-a` | BB Agente Comercial (Prova A) |
| `caixa-2024` | Caixa Técnico Bancário Novo |
| `inss-2022` | INSS Técnico do Seguro Social |

## Comandos

```bash
# Extrai texto + imagens
npx tsx src/data/lib/extract-pdf.mts caixa-2024

# Gera JSON a partir do raw + gabarito
npx tsx src/data/lib/build-prova.mts caixa-2024

# Valida JSON contra config + gabarito oficial
npx tsx src/data/lib/validate-prova.mts caixa-2024

# Corrige gabarito/vazamentos óbvios
npx tsx src/data/lib/fix-prova.mts caixa-2024
```

A revisão editorial (textos de apoio, tabelas, figuras) continua manual sobre o `artefacts/<slug>/raw.txt`.
