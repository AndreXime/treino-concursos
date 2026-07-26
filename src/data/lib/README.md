# Pipeline de provas (Cesgranrio BB Agente Comercial)

## Layout

- `src/data/raw/` — PDFs fonte (provas + gabaritos)
- `src/data/*.json` — JSON consumido pela app
- `src/data/lib/artefacts/` — intermediários (`raw.txt`, imagens); gitignored

## Comandos

```bash
# Extrai texto + imagens de um ou mais PDFs de prova
npx tsx src/data/lib/extract-pdf.mts B C

# Valida JSON contra gabarito oficial do PDF
npx tsx src/data/lib/validate-prova.mts "src/data/PROVA B - AGENTE COMERCIAL - GABARITO 1.json" B 1

# Corrige gabarito/vazamentos óbvios a partir do PDF de gabarito
npx tsx src/data/lib/fix-prova.mts "src/data/PROVA B - AGENTE COMERCIAL - GABARITO 1.json" B 1
```

A revisão editorial (textos de apoio, tabelas, figuras) continua manual sobre o `artefacts/PROVA-X/raw.txt`.
